// Scene two's WebGL proof layer: the existing tool cards above the image plate.
// The room, person, ring, ribbon, particles, and post effects remain available
// in their modules and shaders, but are not submitted by this renderer.

import { program, unitQuad, texture, upload, bind, loadImage } from '../gl/renderer.js';
import { V2_CARD, F2_CARD } from '../gl/shaders2.js';
import { perspective, multiply, compose, projectPoint } from '../lib/mat4.js';
import { buildCards, layoutCards, poseCard } from './cards.js';
import { sample2 } from './timeline2.js';
import { clamp, damp } from '../lib/ease.js';

const TOOLS = [
  'photoshop', 'figma', 'aftereffects', 'premiere', 'notion', 'lightroom',
  'claude', 'chatgpt', 'midjourney', 'spline', 'framer', 'webflow',
];
const CORNERS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
const CAM_Z = 8.2;
const FOV = 0.85;

export class Universe {
  constructor(canvas, gl) {
    this.canvas = canvas;
    this.gl = gl;
    this.cards = buildCards();
    this.pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
    this.hovered = -1;
    this.progs = { card: program(gl, V2_CARD, F2_CARD, 'card') };
    this.quad = unitQuad(gl);
    this.tex = { grain: texture(gl, { wrap: 'repeat' }) };
    this.logos = {};
    this.proj = new Float32Array(16);
    this.mvp = new Float32Array(16);
    this.model = new Float32Array(16);
    this.mvpTmp = new Float32Array(16);
    this.res = [1, 1];
  }

  async load() {
    const gl = this.gl;
    const [grain, ...images] = await Promise.all([
      loadImage('public/tex/grain.png'),
      ...TOOLS.map((name) => loadImage(`public/tools/${name}.png`)),
    ]);
    if (!upload(gl, this.tex.grain, grain)) {
      throw new Error('The grain texture has no decodable image dimensions.');
    }

    TOOLS.forEach((name, index) => {
      const image = images[index];
      const logo = texture(gl);
      if (!upload(gl, logo, image)) {
        throw new Error(`The ${name} logo has no decodable image dimensions.`);
      }
      this.logos[name] = { tex: logo, aspect: image.width / image.height };
    });
  }

  resize(width, height, dpr) {
    const W = Math.round(width * dpr);
    const H = Math.round(height * dpr);
    if (this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W;
      this.canvas.height = H;
    }
    this.res = [W, H];
    const aspect = W / H;
    perspective(FOV, aspect, 0.1, 100, this.proj);

    const narrow = width < 760;
    const tall = aspect < 1.0;
    this.cssW = width;
    this.cssH = height;
    layoutCards(this.cards, aspect, FOV, CAM_Z, {
      spread: tall ? 1.05 : (aspect < 1.5 ? 0.90 : 1),
      lift: tall ? 1.15 : 1,
      sizeMul: tall ? 0.95 : (narrow ? 0.9 : 1),
    });
  }

  setPointer(x, y) {
    const pointer = this.pointer;
    pointer.inside = true;
    pointer.tx = (x / this.cssW) * 2 - 1;
    pointer.ty = 1 - (y / this.cssH) * 2;

    let nearest = -1;
    let nearestDepth = Infinity;
    for (const card of this.cards) {
      const box = card.screen;
      card.hoverTarget = 0;
      if (box && pointer.tx >= box.x0 && pointer.tx <= box.x1
        && pointer.ty >= box.y0 && pointer.ty <= box.y1
        && box.w < nearestDepth) {
        nearest = card.i;
        nearestDepth = box.w;
      }
    }

    this.hovered = nearest;
    if (nearest < 0) return;
    const card = this.cards[nearest];
    const box = card.screen;
    card.hoverTarget = 1;
    card.hoverX = clamp((pointer.tx - (box.x0 + box.x1) * 0.5)
      / Math.max((box.x1 - box.x0) * 0.5, 0.001), -1, 1);
    card.hoverY = clamp((pointer.ty - (box.y0 + box.y1) * 0.5)
      / Math.max((box.y1 - box.y0) * 0.5, 0.001), -1, 1);
  }

  clearPointer() {
    this.pointer.inside = false;
    this.pointer.tx = 0;
    this.pointer.ty = 0;
    this.hovered = -1;
    for (const card of this.cards) {
      card.hoverTarget = 0;
      card.hoverX = 0;
      card.hoverY = 0;
    }
  }

  render(t, dt = 0) {
    const gl = this.gl;
    const [W, H] = this.res;
    const s = sample2(t);
    const pointer = this.pointer;
    pointer.x = damp(pointer.x, pointer.inside ? pointer.tx : 0, 4.0, dt);
    pointer.y = damp(pointer.y, pointer.inside ? pointer.ty : 0, 4.0, dt);
    const ptr = { x: pointer.x * s.float, y: pointer.y * s.float };
    const view = new Float32Array([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 0, -CAM_Z, 1,
    ]);
    multiply(this.proj, view, this.mvp);

    gl.viewport(0, 0, W, H);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindVertexArray(this.quad);

    const cards = this.cards.map((card) => {
      card.hover = damp(card.hover, card.hoverTarget * s.mat, 10, dt);
      const pose = poseCard(card, t, s, ptr);
      return { card, pose, depth: CAM_Z - pose.pos[2] };
    }).sort((a, b) => b.depth - a.depth);

    for (const { card, pose, depth } of cards) {
      const logo = this.logos[card.name];
      const { p, u } = this.progs.card;
      gl.useProgram(p);
      gl.uniform1i(u.uLogo, bind(gl, logo.tex, 0));
      gl.uniform1i(u.uGrain, bind(gl, this.tex.grain, 1));

      const cardAspect = pose.scale[0] / pose.scale[1];
      const pad = 0.70;
      let logoW = pad;
      let logoH = (pad * cardAspect) / logo.aspect;
      if (logoH > pad) {
        logoH = pad;
        logoW = (pad * logo.aspect) / cardAspect;
      }
      gl.uniform2f(u.uLogoScale, logoW, logoH);
      gl.uniform1f(u.uRadius, 0.22);
      gl.uniform1f(u.uAspect, cardAspect);
      gl.uniform1f(u.uOpacity, s.mat);
      gl.uniform1f(u.uMat, s.mat);
      gl.uniform1f(u.uHover, card.hover);
      gl.uniform1f(u.uTime, t);
      gl.uniform2f(u.uLight, -pose.pos[0] * 0.5, -pose.pos[1] * 0.5 + 0.4);

      const halfSize = [pose.scale[0] * 0.5, pose.scale[1] * 0.5];
      compose(pose.pos, pose.rot, halfSize, this.model);
      const backPos = [
        pose.pos[0] - this.model[8] * 0.16,
        pose.pos[1] - this.model[9] * 0.16,
        pose.pos[2] - this.model[10] * 0.16,
      ];
      compose(backPos, pose.rot,
        [halfSize[0] * 1.015, halfSize[1] * 1.015], this.model);
      multiply(this.mvp, this.model, this.mvpTmp);
      gl.uniformMatrix4fv(u.uMVP, false, this.mvpTmp);
      gl.uniform2f(u.uHalf, 1, 1);
      gl.uniform1f(u.uSideFace, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      compose(pose.pos, pose.rot, halfSize, this.model);
      multiply(this.mvp, this.model, this.mvpTmp);
      gl.uniformMatrix4fv(u.uMVP, false, this.mvpTmp);
      gl.uniform1f(u.uSideFace, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      card.screen = this.projectCard(this.mvpTmp, depth);
    }
    gl.bindVertexArray(null);
  }

  projectCard(mvp, depth) {
    let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (const [x, y] of CORNERS) {
      const [px, py] = projectPoint(mvp, x, y, 0);
      x0 = Math.min(x0, px);
      x1 = Math.max(x1, px);
      y0 = Math.min(y0, py);
      y1 = Math.max(y1, py);
    }
    return { x0, x1, y0, y1, w: depth };
  }
}

export { TOOLS };

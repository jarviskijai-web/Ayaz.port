import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { useLoading } from "../../context/LoadingProvider";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const { setLoading } = useLoading();

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateViewport = () => {
      const mobile = window.innerWidth <= 768;
      const reducedMotion = media.matches;
      setIsMobile(mobile);
      setPrefersReducedMotion(reducedMotion);
      setShouldRender3D(!reducedMotion);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    media.addEventListener?.("change", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      media.removeEventListener?.("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!shouldRender3D || !canvasDiv.current || isMountedRef.current) {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const load3DScene = async () => {
      const [{ default: setCharacterModel }, { default: setSceneLighting }, { default: animateCharacter }, { default: handleResizeScene }, mouseUtilsModule, { setProgress: setProgressValue }, threeModule] = await Promise.all([
        import("./utils/character"),
        import("./utils/lighting"),
        import("./utils/animationUtils"),
        import("./utils/resizeUtils"),
        import("./utils/mouseUtils"),
        import("../Loading"),
        import("three"),
      ]);

      if (cancelled || !canvasDiv.current) return;

      const { handleMouseMove: handleMouseMoveScene, handleTouchEnd: handleTouchEndScene, handleHeadRotation: handleHeadRotationScene, handleTouchMove: handleTouchMoveScene } = mouseUtilsModule;
      const THREE = threeModule as typeof import("three");
      const sceneRef = new THREE.Scene();

      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = isMobile ? 0.8 : 0.9;
      renderer.shadowMap.enabled = false;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(isMobile ? 18 : 14.5, aspect, 0.1, 1000);
      camera.position.z = isMobile ? 14 : 10;
      camera.position.set(0, isMobile ? 11.4 : 13.1, isMobile ? 21.5 : 24.7);
      camera.zoom = isMobile ? 1.25 : 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      const clock = new THREE.Clock();
      const light = setSceneLighting(scene);
      let progress = setProgressValue((value: number) => setLoading(value));
      const { loadCharacter } = setCharacterModel(renderer, scene, camera);

      await loadCharacter().then((gltf) => {
        if (cancelled || !gltf) return;
        const animations = animateCharacter(gltf);
        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        const character = gltf.scene;
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;
        progress.loaded().then(() => {
          setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
        const handleResizeListener = () => handleResizeScene(renderer, camera, canvasDiv, character);
        window.addEventListener("resize", handleResizeListener);
        cleanup = () => {
          window.removeEventListener("resize", handleResizeListener);
        };
      });

      let mouse = { x: 0, y: 0 }, interpolation = { x: 0.1, y: 0.2 };
      const onMouseMove = (event: MouseEvent) => {
        handleMouseMoveScene(event, (x: number, y: number) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = window.setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMoveScene(e, (x: number, y: number) => (mouse = { x, y }))
          );
        }, 200);
      };
      const onTouchEnd = () => {
        handleTouchEndScene((x: number, y: number, interpolationX: number, interpolationY: number) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        if (cancelled) return;
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotationScene(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      isMountedRef.current = true;
      return () => {
        cancelled = true;
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        cleanup?.();
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    };

    const idleLoad = window.requestIdleCallback
      ? window.requestIdleCallback(() => {
          void load3DScene();
        })
      : setTimeout(() => {
          void load3DScene();
        }, 250);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleLoad as number);
      } else {
        clearTimeout(idleLoad as number);
      }
      cleanup?.();
    };
  }, [shouldRender3D, setLoading]);

  return (
    <>
      <div className="character-container">
        {isMobile || prefersReducedMotion ? (
          <div className="mobile-character-art">
            <img src="/images/mascot-mobile.svg" alt="Ayaz Ahmad mascot" className="mobile-character-image" />
          </div>
        ) : (
          <div className="character-model" ref={canvasDiv} aria-label="3D character preview">
            <div className="character-rim"></div>
            <div className="character-hover" ref={hoverDivRef}></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Scene;

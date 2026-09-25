import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  split?: "word" | "char";
  duration?: number;
  y?: number;
  stagger?: number;
  once?: boolean;
};

const getReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wrapTextNodes = (element: HTMLElement, split: "word" | "char") => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.textContent && node.textContent.trim()) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent ?? "";
    const parts = split === "word" ? text.split(/(\s+)/) : Array.from(text);

    const fragment = document.createDocumentFragment();

    parts.forEach((part) => {
      if (!part) return;

      const span = document.createElement("span");
      span.className = "legacy-text-reveal-piece";
      span.textContent = part;
      span.style.display = "inline-block";
      span.style.whiteSpace = /\s/.test(part) ? "pre" : "normal";
      span.style.willChange = "transform, opacity, clip-path";
      fragment.appendChild(span);
    });

    textNode.replaceWith(fragment);
  });
};

const TextReveal = ({
  as: Component = "div",
  className,
  children,
  split = "word",
  duration = 0.55,
  y = 24,
  stagger = 0.03,
  once = true,
}: TextRevealProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (element.dataset.revealApplied === "true") {
      return;
    }

    if (getReducedMotion()) {
      element.dataset.revealApplied = "true";
      gsap.set(element, { autoAlpha: 1 });
      return;
    }

    wrapTextNodes(element, split);

    const pieces = Array.from(
      element.querySelectorAll<HTMLElement>(".legacy-text-reveal-piece")
    );

    if (!pieces.length) {
      element.dataset.revealApplied = "true";
      return;
    }

    gsap.set(pieces, {
      opacity: 0,
      y,
      clipPath: "inset(0 100% 0 0)",
      willChange: "transform, opacity, clip-path",
    });

    const reveal = gsap.to(pieces, {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0% 0 0)",
      duration,
      ease: "power2.out",
      stagger,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        once,
      },
    });

    element.dataset.revealApplied = "true";

    return () => {
      reveal.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [children, duration, once, split, stagger, y]);

  return (
    <Component ref={ref as any} className={className}>
      {children}
    </Component>
  );
};

export default TextReveal;

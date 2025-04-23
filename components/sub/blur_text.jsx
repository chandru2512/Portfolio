"use client";

import { useSprings, animated } from "@react-spring/web";
import { useRef, useEffect, useState } from "react";

const AnimatedSpan = animated.span;

const BlurText = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const animatedCount = useRef(0);

  // Default animations
  const defaultFrom =
    direction === "top"
      ? {
          filter: "blur(10px)",
          opacity: 0,
          transform: "translateY(-50px)",
          color: "inherit",
        }
      : {
          filter: "blur(10px)",
          opacity: 0,
          transform: "translateY(50px)",
          color: "inherit",
        };

  const defaultTo = [
    {
      filter: "blur(5px)",
      opacity: 0.5,
      transform: direction === "top" ? "translateY(5px)" : "translateY(-5px)",
    },
    {
      filter: "blur(0px)",
      opacity: 1,
      transform: "translateY(0)",
    },
  ];

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: animationFrom || defaultFrom,
      to: inView ? animationTo || defaultTo : animationFrom || defaultFrom,
      delay: i * delay,
      config: { easing },
      onRest: () => {
        animatedCount.current += 1;
        if (animatedCount.current === elements.length && onAnimationComplete) {
          onAnimationComplete();
        }
      },
    }))
  );

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {springs.map((style, index) => (
        <AnimatedSpan
          key={index}
          style={{
            ...style,
            display: "inline-block",
            willChange: "transform, filter, opacity",
            marginRight:
              animateBy === "words" && index < elements.length - 1
                ? "0.25em"
                : 0,
          }}
        >
          {elements[index] === " " ? "\u00A0" : elements[index]}
        </AnimatedSpan>
      ))}
    </p>
  );
};

export default BlurText;

"use client";

import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fixedWidth, setFixedWidth] = useState<number | undefined>(undefined);

  // Calculate the width needed to fit the widest word on mount (helps mobile sizing)
  useEffect(() => {
    if (!words.length) return;
    // Virtual off-DOM span to measure
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.fontSize = window.innerWidth < 640 ? "2.25rem" : "4rem"; // text-4xl (mobile) or md:text-7xl
    span.style.fontWeight = "bold";
    span.style.fontFamily = "inherit";
    span.style.padding = "0 30px";
    document.body.appendChild(span);
    let maxWidth = 0;
    for (const word of words) {
      span.textContent = word;
      maxWidth = Math.max(maxWidth, span.scrollWidth);
    }
    document.body.removeChild(span);
    setFixedWidth(maxWidth);
    // Recalc on resize for mobile orientation change
    const resizeListener = () => {
      span.style.fontSize = window.innerWidth < 640 ? "2.25rem" : "4rem";
      let maxWidth = 0;
      for (const word of words) {
        span.textContent = word;
        maxWidth = Math.max(maxWidth, span.scrollWidth);
      }
      setFixedWidth(maxWidth);
    };
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
    // eslint-disable-next-line
  }, [words.join(",")]);

  useEffect(() => {
    if (words.length <= 1) return;
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <motion.div
      style={
        fixedWidth
          ? { width: fixedWidth, minWidth: 0, maxWidth: "100%" }
          : undefined
      }
      className={cn(
        "relative inline-block rounded-lg pt-2 pb-3 text-center font-bold text-black dark:text-white overflow-x-hidden",
        "text-4xl md:text-7xl",
        "[background:linear-gradient(to_bottom,#f3f4f6,#e5e7eb)]",
        "shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db]",
        "dark:[background:linear-gradient(to_bottom,#374151,#1f2937)]",
        "dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]",
        className,
        // Ensure no horizontal scroll on mobile
        "px-2 sm:px-4",
      )}
      key={id}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[currentWordIndex]}
          initial={{
            opacity: 0,
            y: 22,
            scale: 0.96,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: animationDuration / 1000,
              type: "spring",
              bounce: 0.22,
            },
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.96,
            filter: "blur(7px)",
            transition: { duration: 0.2 },
          }}
          transition={{
            duration: animationDuration / 1000,
            type: "spring",
            bounce: 0.22,
          }}
          className={cn("inline-block whitespace-nowrap", textClassName)}
        >
          {/* Per-letter animation fallback for desktop, just fade for mobile (perf) */}
          <span className="inline-block sm:hidden">
            {words[currentWordIndex]}
          </span>
          <span className="hidden sm:inline-block">
            {words[currentWordIndex].split("").map((letter, idx) => (
              <motion.span
                key={idx}
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  delay: idx * 0.02,
                }}
                className=""
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

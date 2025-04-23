"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function SurfLoader() {
  const [stage, setStage] = useState(0); // 0: full form, 1: acronym, 2: final
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullForm = ["Solutions", "Creative", "Responsive", "Frontends"];
  const acronym = ["S", "U", "R", "F"];
  const waveRef = useRef(null);

  // Creative sentence with highlighted words
  const creativeSentence = [
    { text: "Solutions ", highlight: false },
    { text: "digital ", highlight: true },
    { text: "waves with ", highlight: false },
    { text: "innovative ", highlight: true },
    { text: "solutions", highlight: true },
  ];

  // Animation logic with cleanup
  useEffect(() => {
    let interval;
    let timeout;

    // Stage 0: Cycle through full form words
    if (stage === 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % fullForm.length);
      }, 800);

      // After cycling through words, move to acronym stage
      timeout = setTimeout(() => {
        setStage(1);
      }, 5000);
    }

    // Stage 1: After showing the acronym animation, move to final stage
    if (stage === 1) {
      timeout = setTimeout(() => {
        setStage(2);
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [stage]);

  // Draw wave animation
  useEffect(() => {
    if (stage !== 1 || !waveRef.current) return;

    const canvas = waveRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0;

    // Set canvas dimensions
    canvas.width = 300;
    canvas.height = 80;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wave
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        // Create wave effect
        const y = Math.sin(x * 0.02 + time) * 15 + canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw second wave with offset
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        // Create wave effect with phase offset
        const y = Math.sin(x * 0.02 + time + 1) * 10 + canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(167, 139, 250, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      time += 0.05;
      animationId = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [stage]);

  // Animation variants
  const wordVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  const letterVariants = {
    initial: { y: 0, opacity: 0 },
    bounce: (i) => ({
      y: [0, -15, 0],
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        repeat: 3,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    }),
  };

  const sentenceVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="text-center">
        {stage === 0 && (
          <h1 className="text-4xl font-light text-white">
            <span className="text-gray-400">We are </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
              >
                {fullForm[currentIndex]}
              </motion.span>
            </AnimatePresence>
          </h1>
        )}

        {stage === 1 && (
          <div className="relative">
            <canvas
              ref={waveRef}
              className="absolute top-10 left-1/2 transform -translate-x-1/2 z-0 opacity-70"
              width="300"
              height="80"
            />
            <h1 className="text-6xl font-bold flex justify-center space-x-4 relative z-10">
              {acronym.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="bounce"
                  className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
            <motion.div
              className="mt-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto mb-4"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              />
            </motion.div>
          </div>
        )}

        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-6xl font-bold flex justify-center space-x-4">
              {acronym.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: i * 0.1, duration: 0.4 },
                  }}
                  className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <div className="flex justify-center mt-8">
              {creativeSentence.map((item, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={sentenceVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-xl ${
                    item.highlight
                      ? "font-semibold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
                      : "text-gray-300"
                  }`}
                >
                  {item.text}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.2, duration: 1 }}
              className="h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 mt-4 mx-auto"
              style={{ maxWidth: "320px" }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

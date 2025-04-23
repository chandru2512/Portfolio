"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import BlurText from "./blur_text";
import { ShimmerButton } from "../ui/button";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center px-4 md:px-20 w-full z-[20]"
    >
      {/* Welcome Box - Centered */}
      <motion.div
        variants={slideInFromTop}
        
      >
        <ShimmerButton className="flex items-center">
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px] text-white">
            Creative Frontend Solutions
          </h1>
        </ShimmerButton>
      </motion.div>

      {/* Main Headline - Perfectly Centered */}
      <div className="flex flex-col items-center text-center w-full max-w-4xl">
        <motion.div variants={slideInFromLeft(0.8)} className="w-full">
          <BlurText
            text="Crafting Responsive digital experiences"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          />
        </motion.div>

        {/* Subheading */}
        <motion.div 
          variants={slideInFromLeft(0.8)}
          className="mt-6 w-full"
        >
          <BlurText
            text="We transform ideas into immersive web experiences"
            delay={150}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-xl text-gray-300 font-medium"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={slideInFromLeft(1)}
          className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl leading-relaxed"
        >
          With cutting-edge frontend technologies and creative solutions tailored to your business needs.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={slideInFromLeft(1)} className="mt-8">
          <motion.a
            className="inline-block py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg hover:bg-opacity-90 transition-all font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Solutions
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};
"use client";

import { HeroContent } from "@/components/sub/hero-content";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from 'three'; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ParticleBackground = () => {
  const particlesRef = useRef();
  const count = 500; // Increased particle count for richer effect
  const positions = useRef();

  if (!positions.current) {
    positions.current = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions.current[i] = (Math.random() - 0.5) * 15; // Increased spread
    }
  }

  useFrame((state) => {
    if (particlesRef.current && typeof window !== "undefined") {
      // Smoother rotation
      particlesRef.current.rotation.x += 0.0001;
      particlesRef.current.rotation.y += 0.0003;
      
      // Enhanced parallax with damping
      const targetZ = -window.scrollY * 0.03;
      particlesRef.current.position.z += (targetZ - particlesRef.current.position.z) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02} // Slightly larger particles
        color="#b49bff"
        sizeAttenuation
        transparent
        opacity={0.8} // More visible
        alphaTest={0.01}
        blending={THREE.AdditiveBlending} // Additive blending for glow effect
      />
    </points>
  );
};

export const Hero = () => {
  const heroRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const nameRef = useRef();
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setMounted(true);
    setDpr(Math.min(window.devicePixelRatio, 2));
  }, []);

  useGSAP(
    () => {
      if (!mounted) return;

      // Apple-like smooth reveal animation
      gsap.fromTo(videoRef.current,
        { opacity: 0, scale: 1.2 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out"
        }
      );

      // Name reveal animation (similar to Dora AI)
      const nameAnimation = gsap.timeline({ paused: true });
      nameAnimation.fromTo(nameRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        }
      );

      // Apple-like scroll animations
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Video scale and opacity on scroll
          gsap.to(videoRef.current, {
            scale: 1 + progress * 0.2,
            opacity: 1 - progress * 0.5,
            duration: 0.1
          });
          
          // Particles fade out on scroll
          gsap.to(canvasRef.current, {
            opacity: 0.5 - progress * 0.5,
            duration: 0.1
          });
          
          // Trigger name reveal at 20% scroll
          if (progress > 0.2 && nameAnimation.progress() === 0) {
            nameAnimation.play();
          }
        }
      });

      // Hero content animations with Apple-like staging
      const contentAnimation = gsap.timeline();
      contentAnimation.from(".hero-content > *", {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "expo.out",
        delay: 0.5
      });

      // Scroll indicator animation
      gsap.to(".scroll-indicator", {
        y: 15,
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: "sine.inOut",
        delay: 2
      });
    },
    { scope: heroRef, dependencies: [mounted] }
  );

  // Video optimization
  useEffect(() => {
    if (!mounted) return;

    const video = videoRef.current;
    if (video) {
      video.playsInline = true;
      video.muted = true;
      video.setAttribute("muted", "");
      video.loop = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      
      // Preload more aggressively for Apple devices
      video.preload = "auto";
      video.load();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(e => console.log("Video play error:", e));
        });
      }
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <section
        ref={heroRef}
        className="relative flex flex-col h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30" />
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col h-screen w-full overflow-hidden"
    >
      {/* Video Background with enhanced Apple-like styling */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-110"
          preload="auto"
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src="/videos/skills-bg.webm" type="video/webm" />
          <source src="/videos/skills-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
      </div>

      {/* Particle Canvas with enhanced depth */}
      <div ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none">
        <Canvas gl={{ antialias: false, alpha: true }} dpr={dpr}>
          <ParticleBackground />
        </Canvas>
      </div>

      {/* Hero Content with Apple-like spacing */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <HeroContent />
      </div>


      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 scroll-indicator">
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2 opacity-80">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/80 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/80 mt-1 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
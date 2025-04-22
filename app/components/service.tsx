"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Theaters as MediaIcon,
  CampaignOutlined as ProgrammaticIcon,
  VerifiedUser as InfluencerIcon,
  ForwardToInbox as EmailIcon,
  ShowChart as PerformanceIcon,
  ArrowOutward as ArrowOutwardIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Custom styled components using emotion
const StyledCard = ({ children, isActive, ...props }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    if (!card) return;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // Dynamic light effect
      const intensity = isActive ? 0.4 : 0.2;
      card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(44, 229, 255, ${intensity}), transparent 40%)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.backgroundImage = 'none';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]);
  
  return (
    <Card
      ref={cardRef}
      {...props}
      sx={{
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease, background-image 0.3s ease',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: '-2px',
          background: isActive ? 
            'linear-gradient(45deg, #00f5ff, #2c98b0, #0088ff, #2ce5ff)' : 
            'linear-gradient(45deg, #1e1e23, #2c2c35)',
          borderRadius: 'inherit',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 1,
          zIndex: 0,
        },
        ...props.sx
      }}
    >
      {children}
    </Card>
  );
};

const GlowingIcon = ({ children, isActive }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: '50%',
        backgroundColor: 'rgba(44, 152, 176, 0.2)',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isActive ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
        overflow: 'visible',
        '&:before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: isActive ? 
            'radial-gradient(circle, rgba(44, 229, 255, 0.8) 0%, rgba(44, 229, 255, 0) 70%)' : 
            'none',
          filter: 'blur(10px)',
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.5s ease',
          transform: 'scale(1.5)',
          zIndex: 0,
        },
        '&:after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: isActive ? '2px solid rgba(44, 229, 255, 0.6)' : 'none',
          boxShadow: isActive ? '0 0 20px rgba(44, 229, 255, 0.8)' : 'none',
          animation: isActive ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.5)', opacity: 0 },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
        },
        zIndex: 1
      }}
    >
      <Box
        sx={{
          color: isActive ? '#2ce5ff' : '#2c98b0',
          zIndex: 2,
          display: 'flex',
          position: 'relative'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const ServiceItem = ({ title, icon, description, isActive, onClick, isExpanded, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const serviceRef = useRef(null);
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      },
      { threshold: 0.2 }
    );
    
    if (serviceRef.current) {
      observer.observe(serviceRef.current);
    }
    
    return () => {
      if (serviceRef.current) {
        observer.unobserve(serviceRef.current);
      }
    };
  }, []);
  
  // Different entrance animations for each service
  const entranceStyles = [
    { transform: 'translateX(-100px) rotateY(-30deg)', opacity: 0 },
    { transform: 'translateY(100px) rotateX(30deg)', opacity: 0 },
    { transform: 'scale(0.7) rotate(-10deg)', opacity: 0 },
    { transform: 'translateX(100px) rotateZ(10deg)', opacity: 0 },
    { transform: 'translateY(-100px) scale(0.8)', opacity: 0 },
    { transform: 'perspective(500px) rotateY(45deg)', opacity: 0 },
  ];

  return (
    <Box 
      ref={serviceRef}
      sx={{ 
        mb: 4, 
        width: '100%',
        perspective: '1000px',
        position: 'relative',
        transform: entranceStyles[index % entranceStyles.length].transform,
        opacity: entranceStyles[index % entranceStyles.length].opacity,
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transitionDelay: `${index * 100}ms`,
        '&.in-view': {
          transform: 'translateX(0) translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(1)',
          opacity: 1
        }
      }}
    >
      <StyledCard 
        isActive={isActive}
        sx={{ 
          borderRadius: '16px',
          overflow: 'visible',
          backgroundColor: isActive ? 'rgba(11, 25, 47, 0.9)' : 'rgba(11, 25, 47, 0.7)',
          boxShadow: isActive ? 
            '0 15px 35px rgba(44, 229, 255, 0.2), 0 8px 15px rgba(0, 0, 0, 0.3)' : 
            '0 8px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 3,
            px: 3,
            cursor: 'pointer',
            borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
            position: 'relative',
            zIndex: 1,
          }}
          onClick={onClick}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <GlowingIcon isActive={isActive}>
              {icon}
            </GlowingIcon>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              component="h3" 
              sx={{ 
                fontWeight: isActive ? 700 : 600,
                color: isActive ? '#2ce5ff' : '#e0e0e0',
                transition: 'all 0.3s ease',
                textShadow: isActive ? '0 0 12px rgba(44, 229, 255, 0.5)' : 'none',
                letterSpacing: isActive ? '1px' : '0.5px',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: isActive ? '100%' : '0%',
                  height: '2px',
                  bottom: '-8px',
                  left: 0,
                  backgroundColor: '#2ce5ff',
                  transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: isActive ? '0 0 8px rgba(44, 229, 255, 0.8)' : 'none',
                }
              }}
            >
              {title}
            </Typography>
          </Box>
          <IconButton 
            sx={{ 
              color: isActive ? '#2ce5ff' : '#e0e0e0',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: isExpanded ? 'rotate(180deg) scale(1.2)' : 'rotate(0deg)',
              backgroundColor: 'rgba(44, 152, 176, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(44, 229, 255, 0.2)',
                transform: isExpanded ? 'rotate(180deg) scale(1.3)' : 'rotate(0deg) scale(1.1)'
              },
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                inset: '-4px',
                borderRadius: '50%',
                background: isActive ? 
                  'radial-gradient(circle, rgba(44, 229, 255, 0.2) 0%, rgba(44, 229, 255, 0) 70%)' : 
                  'none',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }
            }}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        
        <Collapse 
          in={isExpanded} 
          timeout={800}
          unmountOnExit
          sx={{
            transition: 'height 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
        >
          <Box 
            sx={{ 
              p: 4,
              bgcolor: 'rgba(11, 84, 107, 0.7)',
              backdropFilter: 'blur(12px)',
              color: 'white',
              borderRadius: '0 0 16px 16px',
              borderTop: '1px solid rgba(44, 229, 255, 0.2)',
              boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #2ce5ff, transparent)',
              }
            }}
          >
            {/* Particle effect background */}
            <ParticlesBackground isActive={isActive} />
            
            <Typography 
              variant="body1" 
              color="#e0e0e0" 
              paragraph
              sx={{
                lineHeight: 1.8,
                position: 'relative',
                zIndex: 1,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              {description}
            </Typography>
            
            {isActive && (
              <Box 
                sx={{ 
                  mt: 3,
                  display: 'inline-block',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  transform: 'translateZ(0)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px) translateZ(20px)',
                  }
                }}
              >
                <CTA />
              </Box>
            )}
          </Box>
        </Collapse>
      </StyledCard>
    </Box>
  );
};

// Particle background component
const ParticlesBackground = ({ isActive }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 30;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(44, 229, 255, ${Math.random() * 0.3 + 0.1})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.01;
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = '#2ce5ff';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    }
    
    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      if (!isActive) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(44, 229, 255, ${0.1 * (1 - distance/150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    return () => {
      // Cleanup if needed
    };
  }, [isActive]);
  
  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.8s ease',
        zIndex: 0
      }}
    />
  );
};

// CTA Button Component with 3D effects
const CTA = () => {
  const btnRef = useRef(null);
  
  useEffect(() => {
    const btn = btnRef.current;
    
    if (!btn) return;
    
    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      btn.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      
      // Update light effect
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      btn.style.backgroundPosition = `${percentX}% ${percentY}%`;
    };
    
    const handleMouseLeave = () => {
      btn.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(0)';
      btn.style.backgroundPosition = 'center';
    };
    
    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <Typography 
      ref={btnRef}
      component="a" 
      variant="subtitle1"
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        fontWeight: 700,
        textDecoration: 'none',
        px: 4,
        py: 2,
        borderRadius: '8px',
        background: 'linear-gradient(120deg, rgba(44, 152, 176, 0.7), rgba(44, 229, 255, 0.7))',
        backgroundSize: '200% 200%',
        backgroundPosition: 'center',
        boxShadow: '0 8px 25px rgba(44, 229, 255, 0.3)',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))',
          borderRadius: '8px',
          opacity: 0,
          transition: 'opacity 0.5s ease',
        },
        '&:hover': {
          color: '#ffffff',
          transform: 'perspective(500px) translateZ(20px) !important',
          boxShadow: '0 15px 35px rgba(44, 229, 255, 0.5), 0 5px 15px rgba(0, 0, 0, 0.2)',
          letterSpacing: '1px',
          '&:before': {
            opacity: 1,
          }
        }
      }}
    >
      Book a Free Consultation
      <Box 
        component="span" 
        sx={{ 
          display: 'inline-flex',
          ml: 1.5,
          transition: 'all 0.4s ease',
          transform: 'translateZ(10px)',
          '&:hover': {
            transform: 'translateZ(10px) translateX(5px)'
          }
        }}
      >
        <ArrowOutwardIcon fontSize="small" />
      </Box>
    </Typography>
  );
};

// Morphing Background Blob Component
const MorphingBlob = () => {
  const blobRef = useRef(null);
  
  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;
    
    let angle = 0;
    
    const animate = () => {
      angle += 0.01;
      
      const radiusX = 40 + Math.sin(angle) * 10;
      const radiusY = 40 + Math.cos(angle * 1.3) * 10;
      const radiusZ = 40 + Math.sin(angle * 0.7) * 10;
      
      const path = `
        M50,50 
        m-${radiusX},0 
        a${radiusX},${radiusY} 0 1,0 ${radiusX * 2},0 
        a${radiusX},${radiusZ} 0 1,0 -${radiusX * 2},0
      `;
      
      blob.setAttribute('d', path);
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);
  
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      sx={{
        position: 'absolute',
        width: '80%',
        height: '80%',
        top: '10%',
        left: '10%',
        opacity: 0.1,
        filter: 'blur(40px)',
        zIndex: 0
      }}
    >
      <path
        ref={blobRef}
        fill="url(#gradient)"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2ce5ff" />
          <stop offset="50%" stopColor="#2c98b0" />
          <stop offset="100%" stopColor="#0088ff" />
        </linearGradient>
      </defs>
    </Box>
  );
};

// Main Services Component
const ServicesComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);
  const rightPanelRef = useRef(null);
  const [rightPanelInView, setRightPanelInView] = useState(false);
  
  // Services data
  const services = [
    { 
      title: 'Main Media', 
      icon: <MediaIcon fontSize="large" />, 
      description: 'Traditional media channels strategically integrated with digital initiatives to create powerful cross-platform campaigns that maximize impact and ROI.',
      image: "employee-working-marketing-setting.jpg",
      video: "/videos/media-service.mp4"
    },
    { 
      title: 'Programmatic Campaigns', 
      icon: <ProgrammaticIcon fontSize="large" />, 
      description: 'Keep customers informed at every step. Deploy pre-built automation flows for real-time status updates with our AI-powered programmatic advertising solutions.',
      image: "person-front-computer-working-html.jpg",
      video: "/videos/programmatic-service.mp4"
    },
    { 
      title: 'Influencer Marketing', 
      icon: <InfluencerIcon fontSize="large" />, 
      description: 'Perfect-fit partnerships with content creators that align with your brand values and marketing objectives for authentic promotion and engagement.',
      image: "website-hosting-concept-with-screen.jpg",
      video: "/videos/influencer-service.mp4"
    },
    { 
      title: 'E-mail & SMS Marketing', 
      icon: <EmailIcon fontSize="large" />, 
      description: 'Data-driven direct communication channels that deliver personalized content to build lasting customer relationships and drive immediate action.',
      image: "employee-working-marketing-setting.jpg",
      video: "/videos/email-service.mp4"
    },
    { 
      title: 'Social Media Marketing', 
      icon: <PerformanceIcon fontSize="large" />,
      description: 'Strategic planning, content creation, and community management across all major platforms to build engaged communities that amplify brand messages.',
      image: "employee-working-marketing-setting.jpg",
      video: "/videos/social-service.mp4"
    },
    { 
      title: 'Performance Marketing', 
      icon: <PerformanceIcon fontSize="large" />, 
      description: 'Results-driven campaigns focused on measurable outcomes with transparent metrics and clear return on ad spend through our advanced analytics platform.',
      image: "website-hosting-concept-with-screen.jpg",
      video: "/videos/performance-service.mp4"
    }
  ];

  useEffect(() => {
    // Intersection observer for right panel
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRightPanelInView(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (rightPanelRef.current) {
      observer.observe(rightPanelRef.current);
    }
    
    return () => {
      if (rightPanelRef.current) {
        observer.unobserve(rightPanelRef.current);
      }
    };
  }, []);

  const handleServiceClick = (index) => {
    if (expandedServiceIndex === index) {
      setExpandedServiceIndex(null);
      setActiveServiceIndex(0); // Reset to first service when collapsing
    } else {
      setExpandedServiceIndex(index);
      setActiveServiceIndex(index);
    }
  };
  
  // 3D Scene for the right panel
  const Scene3D = () => {
    const sceneRef = useRef(null);
    
    useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      
      const handleMouseMove = (e) => {
        const rect = scene.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;
        
        // Apply parallax effect to layers
        const layers = scene.querySelectorAll('.layer');
        layers.forEach((layer, index) => {
          const depth = index + 1;
          const translateX = moveX * depth;
          const translateY = moveY * depth;
          
          layer.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        });
      };
      
      const handleMouseLeave = () => {
        const layers = scene.querySelectorAll('.layer');
        layers.forEach((layer) => {
          layer.style.transform = 'translateX(0) translateY(0)';
        });
      };
      
      scene.addEventListener('mousemove', handleMouseMove);
      scene.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        scene.removeEventListener('mousemove', handleMouseMove);
        scene.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);
    
    return (
      <Box
        ref={sceneRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          perspective: '1000px',
          overflow: 'hidden',
          borderRadius: '24px',
          cursor: 'pointer'
        }}
      >
        {/* Background layer */}
        <Box
          className="layer"
          sx={{
            position: 'absolute',
            width: '110%',
            height: '110%',
            top: '-5%',
            left: '-5%',
            backgroundImage: `url(${services[activeServiceIndex].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px) brightness(0.7)',
            transition: 'transform 0.5s ease',
            zIndex: 0
          }}
        />
        
        {/* Middle layer with glowing effect */}
        <Box
          className="layer"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.4s ease',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              width: '80%',
              height: '80%',
              background: 'radial-gradient(circle, rgba(44, 229, 255, 0.2) 0%, rgba(11, 84, 107, 0.4) 50%, rgba(10, 25, 47, 0.6) 100%)',
              borderRadius: '20px',
              filter: 'blur(15px)',
              opacity: 0.7
            }}
          />
        </Box>
        
        {/* Content layer */}
        <Box
          className="layer"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            transition: 'transform 0.3s ease',
            zIndex: 2
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
              mb: 4,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #2ce5ff, transparent)',
                borderRadius: '3px'
              }
            }}
          >
            {services[activeServiceIndex].title}
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#e0e0e0',
              textAlign: 'center',
              maxWidth: '80%',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
              lineHeight: 1.8,
              zIndex: 2,
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(10, 25, 47, 0.6)',
              p: 3,
              borderRadius: '12px',
              border: '1px solid rgba(44, 229, 255, 0.2)'
            }}
          >
            {services[activeServiceIndex].description}
          </Typography>
        </Box>
        
        {/* Foreground layer with floating elements */}
        <Box
          className="layer"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none'
          }}
        >
          {/* Floating particles */}
          {[...Array(10)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                backgroundColor: 'rgba(44, 229, 255, 0.2)',
                borderRadius: '50%',
                filter: 'blur(2px)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                  '50%': { transform: `translateY(${Math.random() * 30 - 15}px) rotate(${Math.random() * 60 - 30}deg)` }
                }
              }}
            />
          ))}
          
          {/* Glowing corner accents */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner, i) => (
            <Box
              key={corner}
              sx={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(44, 229, 255, 0.3) 0%, rgba(44, 229, 255, 0) 70%)',
                ...(corner === 'top-left' ? { top: 0, left: 0 } : {}),
                ...(corner === 'top-right' ? { top: 0, right: 0 } : {}),
                ...(corner === 'bottom-left' ? { bottom: 0, left: 0 } : {}),
                ...(corner === 'bottom-right' ? { bottom: 0, right: 0 } : {}),
                opacity: 0.7,
                filter: 'blur(20px)',
                animation: `pulse 4s infinite ease-in-out ${i * 1}s`,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                  '50%': { opacity: 0.7, transform: 'scale(1.2)' }
                }
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#0a192f',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      py: 10,
      px: { xs: 2, md: 6 }
    }}>
      {/* Animated background gradients */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        {/* Abstract shapes */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              background: `radial-gradient(circle, rgba(44, 229, 255, ${0.05 + (i * 0.02)}) 0%, rgba(10, 25, 47, 0) 70%)`,
              borderRadius: '50%',
              filter: 'blur(80px)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              animation: `float ${20 + (i * 5)}s infinite ease-in-out`,
              opacity: 0.6
            }}
          />
        ))}
        
        {/* Morphing blob in background */}
        <MorphingBlob />
        
        {/* Subtle grid overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(44, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(44, 229, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            zIndex: 1
          }}
        />
      </Box>
      
      {/* Header Section with 3D perspective */}
      <Box sx={{ 
        mb: 10, 
        textAlign: 'center',
        position: 'relative',
        zIndex: 2,
        maxWidth: '100%',
        px: { xs: 2, md: 4 },
        perspective: '1000px',
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            transform: rightPanelInView ? 'rotateX(0deg)' : 'rotateX(20deg)',
            opacity: rightPanelInView ? 1 : 0,
            filter: rightPanelInView ? 'blur(0)' : 'blur(5px)',
            transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s',
          }}
        >
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', md: '4rem' },
              lineHeight: 1.1,
              mb: 2,
              background: 'linear-gradient(90deg, #2ce5ff, #2c98b0, #2ce5ff)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 4px 20px rgba(44, 229, 255, 0.3)',
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '5px',
                bottom: '-10px',
                left: 0,
                background: 'linear-gradient(90deg, transparent, #2ce5ff, transparent)',
                transform: 'scaleX(0.7)',
                transformOrigin: 'center',
                transition: 'transform 0.5s ease',
              },
              '&:hover:after': {
                transform: 'scaleX(1)'
              }
            }}
          >
            Our Services
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#b0b0b0',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.6,
              mt: 4
            }}
          >
            Comprehensive digital marketing solutions tailored to your business needs
          </Typography>
        </Box>
        
        {/* Floating accent elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '2px solid rgba(44, 229, 255, 0.1)',
            top: '-40px',
            left: '5%',
            animation: 'rotate 20s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              backgroundColor: 'rgba(44, 229, 255, 0.6)',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 20px rgba(44, 229, 255, 0.8)'
            }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '2px solid rgba(44, 229, 255, 0.1)',
            bottom: '-20px',
            right: '10%',
            animation: 'rotate 15s linear infinite reverse',
            '&:before': {
              content: '""',
              position: 'absolute',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(44, 229, 255, 0.6)',
              bottom: 0,
              right: '30%',
              boxShadow: '0 0 20px rgba(44, 229, 255, 0.8)'
            }
          }}
        />
      </Box>

      {/* Main Content - Side by Side Sections */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 6, lg: 4 },
        position: 'relative',
        zIndex: 2,
        width: '100%',
        m: 0
      }}>
        {/* Left Side - Service Items */}
        <Box sx={{
          flex: isTablet ? '1 1 100%' : '1 1 60%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          pr: { lg: 4 }
        }}>
          {services.map((service, index) => (
            <ServiceItem 
              key={index}
              title={service.title} 
              icon={service.icon}
              description={service.description}
              isActive={activeServiceIndex === index}
              onClick={() => handleServiceClick(index)}
              isExpanded={expandedServiceIndex === index}
              index={index}
            />
          ))}
        </Box>

        {/* Right Side - 3D Scene Section */}
        <Box 
          ref={rightPanelRef}
          sx={{
            flex: isTablet ? '1 1 100%' : '1 1 40%',
            width: '100%',
            position: { lg: 'sticky' },
            top: { lg: '100px' },
            alignSelf: { lg: 'flex-start' },
            height: { xs: '500px', md: '600px' },
            borderRadius: '24px',
            overflow: 'hidden',
            transform: rightPanelInView ? 'translateY(0) rotateY(0)' : 'translateY(100px) rotateY(10deg)',
            opacity: rightPanelInView ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 0 30px rgba(44, 229, 255, 0.2)',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            transformOrigin: 'center center',
          }}
        >
          {/* Content with 3D parallax effect */}
          <Scene3D />
          
          {/* Glowing border effect */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              padding: '2px',
              background: 'linear-gradient(45deg, rgba(44, 229, 255, 0.3), rgba(10, 25, 47, 0), rgba(44, 229, 255, 0.3))',
              backgroundSize: '300% 300%',
              animation: 'borderGlow 5s ease infinite',
              zIndex: 10,
              pointerEvents: 'none',
              '@keyframes borderGlow': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default ServicesComponent;
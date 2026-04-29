import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/logomarca.png';

const Bubble = ({ delay, size, left }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: -500, opacity: [0, 0.6, 0.3, 0] }}
    transition={{
      duration: Math.random() * 5 + 5,
      repeat: Infinity,
      delay: delay,
      ease: "linear"
    }}
    style={{
      position: 'absolute',
      bottom: '0',
      left: left,
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 0 15px rgba(255, 255, 255, 0.25)',
      pointerEvents: 'none'
    }}
  />
);

const Hero = ({ home = {} }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [vw, setVw] = useState(1024);
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = vw < 768;
  const isTablet = vw >= 768 && vw < 1024;

  const shoeScale = isMobile ? 0.35 : isTablet ? 0.45 : 0.6;
  const cameraFov = isMobile ? 40 : 30;
  const zoomAmount = isMobile ? 1.5 : 2.5;
  const heroHeight = isMobile ? '350vh' : '450vh';

  const bubbles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    size: (Math.random() * 40 + 15) + 'px',
    left: Math.random() * 100 + '%',
    delay: Math.random() * 6
  }));

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [0.08, 1]);

  const blackBgOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const bubblesOpacity = useTransform(scrollYProgress, [0.4, 0.55, 0.65, 0.8], [0, 1, 1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.7, 0.95], [0, 1, 1, 0]);
  const revealY = useTransform(scrollYProgress, [0.45, 0.6], [40, 0]);

  return (
    <section ref={heroRef} style={{ height: heroHeight, position: 'relative', width: '100%' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>

        {/* Background logo */}
        <motion.img
          src={logoImg}
          alt=""
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '75vw' : '85vw',
            maxWidth: '1600px',
            objectFit: 'contain',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: textOpacity
          }}
        />

        {/* 3D Canvas */}
        {mounted && typeof window !== 'undefined' && (() => {
          const { Canvas } = require('@react-three/fiber');
          const { Environment, PresentationControls } = require('@react-three/drei');
          const { Shoe3D } = require('./Shoe3D');

          return (
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <Canvas shadows dpr={[1, 2]} camera={{ fov: cameraFov, position: [0, 0, 8] }}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <PresentationControls global={false} snap={true} speed={1.5} zoom={1} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 2, Math.PI / 2]}>
                  <Shoe3D scrollProgress={scrollYProgress} scale={shoeScale} zoomAmount={zoomAmount} isMobile={isMobile} position={[0, -0.5, 0]} />
                </PresentationControls>
              </Canvas>
            </div>
          );
        })()}

        {/* Fundo preto */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#000', zIndex: 8,
            pointerEvents: 'none', opacity: blackBgOpacity
          }}
        />

        {/* Bolhas animadas */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            zIndex: 10, pointerEvents: 'none',
            overflow: 'hidden',
            opacity: bubblesOpacity
          }}
        >
          {bubbles.map(bubble => (
            <Bubble
              key={bubble.id}
              size={bubble.size}
              left={bubble.left}
              delay={bubble.delay}
            />
          ))}
        </motion.div>

        {/* "Por que a New Shoes?" */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            padding: '0 clamp(20px, 5vw, 60px)',
            zIndex: 15, pointerEvents: 'none',
            opacity: revealOpacity, y: revealY
          }}
        >
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(22px, 5vw, 48px)', fontWeight: '600', color: '#fff', marginBottom: '10px', textAlign: 'center' }}>
            {home.benefits_title
              ? home.benefits_title
              : <>{t('benefits.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('benefits.title_highlight')}</span></>}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(13px, 2.5vw, 18px)', textAlign: 'center', marginBottom: '20px' }}>
            {home.benefits_subtitle || t('benefits.subtitle')}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(12px, 2vw, 16px)', textAlign: 'center', maxWidth: '600px', lineHeight: '1.6' }}>
            {home.benefits_hero_description || t('benefits.hero_description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

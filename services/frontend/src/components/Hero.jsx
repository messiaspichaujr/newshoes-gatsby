import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import fundoBolhas from '../assets/fundo-com-bolhas.png';

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

  // Responsive shoe
  const shoeScale = isMobile ? 0.35 : isTablet ? 0.45 : 0.6;
  const cameraFov = isMobile ? 40 : 30;
  const zoomAmount = isMobile ? 1.5 : 2.5;

  // Responsive bg
  const bgSize = isMobile ? 'clamp(280px, 85vw, 600px) auto' : 'clamp(900px, 80vw, 1300px) auto';

  // Responsive scroll height (menor em mobile)
  const heroHeight = isMobile ? '350vh' : '450vh';

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Fase 1a: "NEW SHOES" ganha força (0% → 30%)
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [0.04, 1]);

  // Fase 2: Fundo com bolhas desliza de baixo pra cima (35% → 65%)
  const bgY = useTransform(scrollYProgress, (latest) => {
    const height = typeof window !== 'undefined' ? window.innerHeight : 1000;
    if (latest <= 0.35) return height;
    if (latest >= 0.65) return 0;
    const progress = (latest - 0.35) / 0.3;
    const eased = 1 - Math.pow(1 - progress, 3);
    return height * (1 - eased);
  });

  const blackBgOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const bgFadeOpacity = useTransform(scrollYProgress, [0.45, 0.6], [1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.7, 0.95], [0, 1, 1, 0]);
  const revealY = useTransform(scrollYProgress, [0.45, 0.6], [40, 0]);

  return (
    <section ref={heroRef} style={{ height: heroHeight, position: 'relative', width: '100%' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>

        {/* Background text */}
        <motion.h1
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: isMobile ? '12vw' : isTablet ? '10vw' : '10vw',
            fontWeight: '900', color: '#000', zIndex: 0,
            pointerEvents: 'none', whiteSpace: 'nowrap',
            fontFamily: 'StretchPro, sans-serif',
            opacity: textOpacity
          }}
        >
          {home.hero_title || t('hero.title')}
        </motion.h1>

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

        {/* Fundo com bolhas */}
        <motion.div
          style={{
            position: 'absolute', left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${fundoBolhas})`,
            backgroundSize: bgSize,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 10, y: bgY, opacity: bgFadeOpacity
          }}
        />

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
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(13px, 2.5vw, 18px)', textAlign: 'center' }}>
            {home.benefits_subtitle || t('benefits.subtitle')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

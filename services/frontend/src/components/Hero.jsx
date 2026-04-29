import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/logomarca.png';
import FoamTransition from './FoamTransition';

const Hero = ({ home = {} }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [vw, setVw] = useState(1024);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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

  // Parallax transforms
  const shoeY = useTransform(scrollYProgress, [0, 0.3], [0, -300]);
  const shoeOpacity = useTransform(scrollYProgress, [0.1, 0.35], [1, 0]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6], [0.06, 0.06, 1]);
  const bubbleOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.55, 0.75], [60, 0]);

  return (
    <section ref={containerRef} style={{ position: 'relative', height: '400vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>

        {/* Layer 0: Background logo */}
        <motion.img
          src={logoImg}
          alt=""
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '55vw' : '60vw',
            maxWidth: '900px',
            objectFit: 'contain',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: logoOpacity,
            filter: 'brightness(1.1) contrast(1.1)',
          }}
        />

        {/* Layer 1: 3D Canvas */}
        {mounted && typeof window !== 'undefined' && (() => {
          const { Canvas } = require('@react-three/fiber');
          const { Environment, PresentationControls } = require('@react-three/drei');
          const { Shoe3D } = require('./Shoe3D');

          return (
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: shoeOpacity, y: shoeY }}>
              <Canvas shadows dpr={[1, 2]} camera={{ fov: isMobile ? 40 : 30, position: [0, 0, 8] }}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <PresentationControls global={false} snap={true} speed={1.5} zoom={1} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 2, Math.PI / 2]}>
                  <Shoe3D scale={shoeScale} isMobile={isMobile} position={[0, -0.5, 0]} />
                </PresentationControls>
              </Canvas>
            </motion.div>
          );
        })()}

        {/* Layer 2: Bubbles */}
        <FoamTransition scrollProgress={scrollYProgress} />

        {/* Layer 3: Reveal text */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 25, opacity: textOpacity, y: textY,
          padding: '20px',
          pointerEvents: 'none',
        }}>
          <h2 style={{
            fontFamily: "'StretchPro', sans-serif",
            fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(32px, 4vw, 52px)',
            color: '#000', textAlign: 'center',
            maxWidth: '800px', lineHeight: 1.2,
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            {t('hero.reveal_title')}
          </h2>
          <p style={{
            fontSize: isMobile ? 'clamp(14px, 3vw, 16px)' : 'clamp(16px, 2vw, 20px)',
            color: '#555', textAlign: 'center',
            maxWidth: '600px', lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif',
            marginBottom: '32px',
          }}>
            {t('hero.reveal_desc')}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { key: 'hero.badge1', color: '#22c55e' },
              { key: 'hero.badge2', color: '#1CAAD9' },
              { key: 'hero.badge3', color: '#a855f7' },
            ].map(({ key, color }) => (
              <span key={key} style={{
                backgroundColor: color, color: '#fff',
                padding: '10px 24px', borderRadius: '50px',
                fontSize: '14px', fontWeight: '700',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.5px',
              }}>
                {t(key)}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;

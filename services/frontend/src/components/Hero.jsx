import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/logomarca.png';
import FoamTransition from './FoamTransition';

const Hero = ({ home = {} }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [vw, setVw] = useState(1024);

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

  return (
    <section style={{ height: '100vh', position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>

      {/* Background logo */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.5 }}
        src={logoImg}
        alt=""
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '75vw' : '85vw',
          maxWidth: '1600px',
          objectFit: 'contain',
          zIndex: 0,
          pointerEvents: 'none'
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
                <Shoe3D scale={shoeScale} isMobile={isMobile} position={[0, -0.5, 0]} />
              </PresentationControls>
            </Canvas>
          </div>
        );
      })()}

      <FoamTransition />

    </section>
  );
};

export default Hero;

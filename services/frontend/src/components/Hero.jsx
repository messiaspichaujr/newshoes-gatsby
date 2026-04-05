import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FoamTransition from './FoamTransition';

const Hero = ({ home = {} }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section style={{ height: '100vh', minHeight: '500px', width: '100%', backgroundColor: '#f5f5f5', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(80px, 14vw, 140px)' }}>
      {mounted && typeof window !== 'undefined' && (() => {
        const { Canvas } = require('@react-three/fiber');
        const { Environment, PresentationControls } = require('@react-three/drei');
        const { Shoe3D } = require('./Shoe3D');

        return (
          <Canvas shadows dpr={[1, 2]} camera={{ fov: 30, position: [0, 0, 8] }}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <PresentationControls global={false} snap={true} speed={1.5} zoom={1} rotation={[0, 0, 0]} polar={[-Math.PI / 4, Math.PI / 4]} azimuth={[-Math.PI / 2, Math.PI / 2]}>
              <Shoe3D scale={0.6} position={[0, -0.5, 0]} />
            </PresentationControls>
          </Canvas>
        );
      })()}
      <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '12vw', fontWeight: '900', color: 'rgba(0,0,0,0.04)', zIndex: 0, pointerEvents: 'none', whiteSpace: 'nowrap', fontFamily: 'Space Grotesk, sans-serif' }}>
        {home.hero_title || t('hero.title')}
      </h1>
      <FoamTransition />
    </section>
  );
};

export default Hero;

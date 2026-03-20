import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FoamTransition = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [200, -800]);
  const y2 = useTransform(scrollY, [0, 500], [300, -900]);
  const y3 = useTransform(scrollY, [0, 500], [400, -700]);

  const bubbleStyle = {
    position: 'absolute',
    bottom: '-100px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    filter: 'blur(8px)',
    zIndex: 20
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <motion.div style={{ ...bubbleStyle, width: '400px', height: '400px', left: '-10%', y: y1 }} />
      <motion.div style={{ ...bubbleStyle, width: '500px', height: '500px', right: '-10%', y: y2 }} />
      <motion.div style={{ ...bubbleStyle, width: '300px', height: '300px', left: '30%', y: y3 }} />
      <motion.div style={{ ...bubbleStyle, width: '600px', height: '600px', left: '50%', transform: 'translateX(-50%)', y: y2, opacity: 0.8 }} />
    </div>
  );
};

export default FoamTransition;

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FoamTransition = ({ scrollProgress }) => {
  const { scrollYProgress: fallbackProgress } = useScroll();
  const progress = scrollProgress ?? fallbackProgress;

  const y1 = useTransform(progress, [0, 0.6], [200, -1200]);
  const y2 = useTransform(progress, [0, 0.6], [300, -1400]);
  const y3 = useTransform(progress, [0, 0.6], [400, -1100]);
  const y4 = useTransform(progress, [0, 0.6], [250, -1300]);
  const y5 = useTransform(progress, [0, 0.6], [350, -1250]);
  const y6 = useTransform(progress, [0, 0.6], [150, -1150]);
  const bubbleOpacity = useTransform(progress, [0.3, 0.55], [1, 0]);

  const bubbleStyle = {
    position: 'absolute',
    bottom: '-100px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    filter: 'blur(6px)',
    zIndex: 20
  };

  return (
    <motion.div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      opacity: bubbleOpacity
    }}>
      <motion.div style={{ ...bubbleStyle, width: '200px', height: '200px', left: '-10%', y: y1 }} />
      <motion.div style={{ ...bubbleStyle, width: '250px', height: '250px', right: '-10%', y: y2 }} />
      <motion.div style={{ ...bubbleStyle, width: '150px', height: '150px', left: '30%', y: y3 }} />
      <motion.div style={{ ...bubbleStyle, width: '300px', height: '300px', left: '50%', transform: 'translateX(-50%)', y: y4, opacity: 0.8 }} />
      <motion.div style={{ ...bubbleStyle, width: '180px', height: '180px', left: '70%', y: y5 }} />
      <motion.div style={{ ...bubbleStyle, width: '220px', height: '220px', left: '15%', y: y6, opacity: 0.7 }} />
    </motion.div>
  );
};

export default FoamTransition;

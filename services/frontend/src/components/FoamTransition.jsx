import React from 'react';
import { motion, useTransform } from 'framer-motion';

const Bubble = ({ scrollProgress, width, height, left, right, yRange, opacityRange, style = {} }) => {
  const y = useTransform(scrollProgress, yRange[0], yRange[1]);
  const opacity = useTransform(scrollProgress, opacityRange[0], opacityRange[1]);

  return (
    <motion.div style={{
      position: 'absolute',
      bottom: '-100px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      filter: 'blur(6px)',
      width, height, left, right,
      y, opacity,
      ...style,
    }} />
  );
};

const FoamTransition = ({ scrollProgress }) => {
  const bgOpacity = useTransform(scrollProgress, [0.3, 0.55], [0, 1]);

  if (!scrollProgress) return null;

  const bubbles = [
    { w: '200px', h: '200px', left: '-10%', yR: [[0.35, 0.7], [200, -800]], oR: [[0.35, 0.55, 0.75], [0, 1, 0]] },
    { w: '250px', h: '250px', right: '-10%', yR: [[0.38, 0.72], [300, -900]], oR: [[0.38, 0.58, 0.78], [0, 1, 0]] },
    { w: '150px', h: '150px', left: '30%', yR: [[0.4, 0.7], [250, -700]], oR: [[0.4, 0.6, 0.8], [0, 1, 0]] },
    { w: '300px', h: '300px', left: '50%', yR: [[0.36, 0.7], [200, -850]], oR: [[0.36, 0.56, 0.76], [0, 0.8, 0]], style: { transform: 'translateX(-50%)' } },
    { w: '180px', h: '180px', left: '70%', yR: [[0.42, 0.72], [300, -750]], oR: [[0.42, 0.62, 0.82], [0, 1, 0]] },
    { w: '220px', h: '220px', left: '15%', yR: [[0.44, 0.74], [150, -800]], oR: [[0.44, 0.64, 0.84], [0, 0.7, 0]] },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', overflow: 'hidden',
      zIndex: 20,
    }}>
      <motion.div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#f5f5f5',
        opacity: bgOpacity,
      }} />
      {bubbles.map((b, i) => (
        <Bubble
          key={i}
          scrollProgress={scrollProgress}
          width={b.w}
          height={b.h}
          left={b.left}
          right={b.right}
          yRange={b.yR}
          opacityRange={b.oR}
          style={b.style}
        />
      ))}
    </div>
  );
};

export default FoamTransition;

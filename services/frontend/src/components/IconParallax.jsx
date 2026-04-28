import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import elem1 from '../assets/1-elemento.png';
import elem2 from '../assets/2-elemento.png';
import elem3 from '../assets/3-elemento.png';
import elem4 from '../assets/4-elemento.png';
import elem5 from '../assets/5-elemento.png';
import elem6 from '../assets/6-elemento.png';

const elements = [
  { src: elem1, x: '5%', y: '10%', width: '200px', maxRotation: 360, maxMove: 80 },
  { src: elem2, x: '75%', y: '5%', width: '170px', maxRotation: 180, maxMove: 60 },
  { src: elem3, x: '20%', y: '60%', width: '180px', maxRotation: 270, maxMove: 90 },
  { src: elem4, x: '85%', y: '55%', width: '150px', maxRotation: 360, maxMove: 70 },
  { src: elem5, x: '45%', y: '20%', width: '220px', maxRotation: 120, maxMove: 50 },
  { src: elem6, x: '55%', y: '70%', width: '175px', maxRotation: 360, maxMove: 80 },
];

const ParallaxElement = ({ data, scrollProgress }) => {
  const rotation = useTransform(scrollProgress, [0, 1], [0, data.maxRotation]);
  const y = useTransform(scrollProgress, [0, 1], [0, -data.maxMove]);

  return (
    <motion.img
      src={data.src}
      alt=""
      style={{
        position: 'absolute',
        left: data.x,
        top: data.y,
        width: data.width,
        rotate: rotation,
        y: y,
        opacity: 0.7,
        pointerEvents: 'none',
        objectFit: 'contain'
      }}
    />
  );
};

const IconParallax = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height: '70vh',
        minHeight: '500px',
        background: '#f5f5f5',
        overflow: 'hidden'
      }}
    >
      {elements.map((data, index) => (
        <ParallaxElement key={index} data={data} scrollProgress={scrollYProgress} />
      ))}
    </section>
  );
};

export default IconParallax;

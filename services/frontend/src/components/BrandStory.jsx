import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'gatsby';
import fundoTeste from '../assets/fundo-teste.png';

const BrandStory = ({ home = {} }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);

  return (
    <section id="brand" ref={ref} style={{ position: 'relative', height: '80vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <motion.div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${fundoTeste})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY,
          zIndex: -1
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '800px',
          margin: '20px',
          padding: 'clamp(24px, 5vw, 60px)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '30px',
          color: '#fff',
          textAlign: 'center',
          zIndex: 1
        }}
      >
        <h2 style={{ fontFamily: "'StretchPro', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '20px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {home.brand_title_prefix || t('brand.title_prefix')}{' '}
          <span style={{ color: '#1CAAD9' }}>{home.brand_title_highlight || t('brand.title_highlight')}</span>
          A EXPERIEENCIA
        </h2>
        <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', lineHeight: '1.8', marginBottom: '40px', fontWeight: '300' }}>
          {home.brand_paragraph || (
            <Trans i18nKey="brand.paragraph">
              Placeholder text <strong style={{ color: '#1CAAD9' }}>17 years of experience</strong> more text.
            </Trans>
          )}
        </p>

        <Link to="/nossa-historia" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#1CAAD9', borderColor: '#1CAAD9' }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '15px 40px',
              border: '2px solid #fff',
              backgroundColor: 'transparent',
              color: '#fff',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              letterSpacing: '1px'
            }}
          >
            {home.brand_cta || t('brand.cta')}
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default BrandStory;

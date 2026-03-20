import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Bubble = ({ delay, size, left }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: -300, opacity: [0, 0.5, 0] }}
    transition={{
      duration: Math.random() * 5 + 5,
      repeat: Infinity,
      delay: delay,
      ease: "linear"
    }}
    style={{
      position: 'absolute',
      bottom: '-50px',
      left: left,
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
      pointerEvents: 'none',
      zIndex: 0
    }}
  />
);

const Footer = () => {
  const { t } = useTranslation();

  const styles = {
    wrapper: {
      width: '100%',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      justifyContent: 'center',
      padding: '0',
      margin: '0',
      position: 'relative',
      overflow: 'hidden'
    },
    container: {
      width: '100%',
      maxWidth: '1400px',
      padding: '80px 40px 40px 40px',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      position: 'relative',
      zIndex: 1
    },
    topSection: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '40px',
      marginBottom: '60px'
    },
    brandColumn: {
      maxWidth: '350px'
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '900',
      fontStyle: 'italic',
      marginBottom: '20px',
      display: 'block',
      letterSpacing: '-1px',
      fontFamily: 'Space Grotesk, sans-serif'
    },
    description: {
      color: '#a1a1a1',
      lineHeight: '1.6',
      fontSize: '14px'
    },
    linksGroup: {
      display: 'flex',
      gap: '80px',
      flexWrap: 'wrap'
    },
    linksColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    columnTitle: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#666',
      marginBottom: '10px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontFamily: 'Space Grotesk, sans-serif'
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      opacity: 0.8,
      transition: '0.2s'
    },
    bottomBar: {
      borderTop: '1px solid #222',
      paddingTop: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      color: '#666',
      fontSize: '12px',
      alignItems: 'center'
    }
  };

  const bubbles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10 + 'px',
    left: Math.random() * 100 + '%',
    delay: Math.random() * 5
  }));

  return (
    <footer style={styles.wrapper}>

      {bubbles.map(bubble => (
        <Bubble
          key={bubble.id}
          size={bubble.size}
          left={bubble.left}
          delay={bubble.delay}
        />
      ))}

      <div style={styles.container}>

        <div style={styles.topSection}>
          <div style={styles.brandColumn}>
            <span style={styles.logoText}>{t('footer.logo_text')}</span>
            <p style={styles.description}>
              {t('footer.description')}
            </p>
          </div>

          <div style={styles.linksGroup}>
            <div style={styles.linksColumn}>
              <span style={styles.columnTitle}>{t('footer.support')}</span>
              <a href="#" style={styles.link}>{t('footer.service_guarantee')}</a>
              <a href="#" style={styles.link}>{t('footer.how_it_works')}</a>
              <a href="#" style={styles.link}>{t('footer.contact')}</a>
            </div>

            <div style={styles.linksColumn}>
              <span style={styles.columnTitle}>{t('footer.company')}</span>
              <a href="#" style={styles.link}>{t('footer.about_us')}</a>
              <a href="#franchise" style={styles.link}>{t('footer.franchises')}</a>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <span>{t('footer.copyright')}</span>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
            <span style={{ cursor: 'pointer' }}>{t('footer.instagram')}</span>
            <span style={{ cursor: 'pointer' }}>{t('footer.whatsapp')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

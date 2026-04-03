import React from 'react';
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/logo-marca.png';
import { motion } from 'framer-motion';
import BubbleMenu from './BubbleMenu';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();

  const menuItems = [
    { label: t('nav.home'), href: '/', rotation: -5, hoverStyles: { bgColor: '#000000', textColor: '#1CAAD9' } },
    { label: t('nav.benefits'), href: '/#benefits', rotation: 5, hoverStyles: { bgColor: '#1CAAD9', textColor: '#ffffff' } },
    { label: t('nav.brand'), href: '/#brand', rotation: -5, hoverStyles: { bgColor: '#000000', textColor: '#ffffff' } },
    { label: t('nav.locations'), href: '/#locator', rotation: 5, hoverStyles: { bgColor: '#1CAAD9', textColor: '#ffffff' } },
    { label: t('nav.franchise'), href: '/#franchise', rotation: -5, hoverStyles: { bgColor: '#000000', textColor: '#1CAAD9' } },
    { label: t('nav.sac'), href: '/#sac', rotation: 5, hoverStyles: { bgColor: '#1CAAD9', textColor: '#ffffff' } }
  ];

  const styles = {
    wrapper: { width: '100%', padding: '0 20px', display: 'flex', justifyContent: 'center', position: 'fixed', top: '40px', left: 0, zIndex: 100 },
    container: { width: '100%', maxWidth: '1400px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '10px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '50%', backgroundColor: 'transparent', color: '#000', textDecoration: 'none' }
  };

  const WhatsAppIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 1h4a.5.5 0 0 0 1-1v-1" />
    </svg>
  );

  const AnimatedIcon = ({ children, href }) => (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" style={styles.iconButton}
      whileHover={{ scale: 1.1, backgroundColor: '#f0f0f0', color: '#1CAAD9' }}
      whileTap={{ scale: 0.95 }}>
      {children}
    </motion.a>
  );

  return (
    <nav style={styles.wrapper}>
      <motion.div style={styles.container} initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BubbleMenu items={menuItems} logo={null} useFixedPosition={false}
            style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', padding: 0, pointerEvents: 'auto', zIndex: 201 }} />
        </div>
        <div style={{ width: '180px', display: 'flex', justifyContent: 'center' }}>
          <img src={logoImg} alt="New Shoes Logo" style={{ width: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageSwitcher />
          <AnimatedIcon href="https://instagram.com"><Instagram size={24} strokeWidth={1.5} /></AnimatedIcon>
          <AnimatedIcon href="https://wa.me/5547999999999"><WhatsAppIcon size={24} /></AnimatedIcon>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;

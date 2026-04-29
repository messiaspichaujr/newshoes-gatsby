import React, { useState, useMemo } from 'react';
import { Instagram, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStaticQuery, graphql } from 'gatsby';
import logoImg from '../assets/logo-marca.png';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import BubbleMenu from './BubbleMenu';
import LanguageSwitcher from './LanguageSwitcher';
import FranchiseSearchModal from './FranchiseSearchModal';

const DEFAULT_WHATSAPP = '5547991180109'

const Navbar = ({ whatsapp, unidades: unidadesProp = [] } = {}) => {
  const waNumber = whatsapp ? whatsapp.replace(/\D/g, '').replace(/^0/, '55') : DEFAULT_WHATSAPP
  const waHref = `https://wa.me/${waNumber}`
  const { t } = useTranslation();
  const [navVisible, setNavVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();

  const staticData = useStaticQuery(graphql`
    query NavbarUnidades {
      allStrapiUnidade(sort: {nome: ASC}) {
        nodes {
          id
          nome
          slug
          endereco
          whatsapp
          estado
          cidade
          imagem_url
          locale
        }
      }
    }
  `)

  const unidades = useMemo(() => {
    if (unidadesProp.length > 0) return unidadesProp
    const all = staticData.allStrapiUnidade?.nodes || []
    const pt = all.filter(u => !u.locale || u.locale === 'pt-BR')
    return pt.length > 0 ? pt : all
  }, [unidadesProp, staticData])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined) {
      setNavVisible(latest < previous);
    }
  });

  const menuItems = [
    { label: t('nav.home'), href: '/', rotation: -5, hoverStyles: { bgColor: '#000000', textColor: '#1CAAD9' } },
    { label: t('nav.benefits'), href: '/#benefits', rotation: 5, hoverStyles: { bgColor: '#1CAAD9', textColor: '#ffffff' } },
    { label: t('nav.brand'), href: '/#brand', rotation: -5, hoverStyles: { bgColor: '#000000', textColor: '#ffffff' } },
    { label: t('nav.franchise'), href: '/#franchise', rotation: 5, hoverStyles: { bgColor: '#000000', textColor: '#1CAAD9' } }
  ];

  const styles = {
    wrapper: {
      width: '100%',
      padding: '0 clamp(10px, 2vw, 20px)',
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
      top: 'clamp(10px, 3vw, 40px)',
      left: 0,
      zIndex: 100
    },
    container: {
      width: '100%',
      maxWidth: '1400px',
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      borderRadius: 'clamp(20px, 4vw, 40px)',
      padding: 'clamp(6px, 1vw, 10px) clamp(14px, 3vw, 40px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px'
    },
    iconButton: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(6px, 1vw, 10px)',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      color: '#000',
      textDecoration: 'none'
    }
  };

  const WhatsAppIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
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
    <>
      <nav style={styles.wrapper}>
        <motion.div style={styles.container} initial={{ y: -100, opacity: 0 }} animate={{ y: navVisible ? 0 : -30, opacity: navVisible ? 1 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          {/* Esquerda: Menu + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BubbleMenu items={menuItems} logo={null} useFixedPosition={false}
              style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', padding: 0, pointerEvents: 'auto', zIndex: 201 }} />
            <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logoImg} alt="New Shoes Logo" style={{ width: 'clamp(80px, 20vw, 150px)', objectFit: 'contain', display: 'block' }} />
            </a>
          </div>

          {/* Direita: Busca + Idioma + Insta + WhatsApp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(2px, 1vw, 8px)' }}>
            <motion.button
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.1, backgroundColor: '#f0f0f0' }}
              whileTap={{ scale: 0.95 }}
              style={{
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                padding: 'clamp(6px, 1vw, 10px) clamp(10px, 2vw, 16px)',
                borderRadius: '50px', backgroundColor: 'transparent', border: 'none',
                color: '#000', fontSize: '13px', fontFamily: 'Inter, sans-serif'
              }}
            >
              <Search size={18} strokeWidth={1.5} />
              <span className="hide-on-mobile" style={{ color: '#888' }}>{t('locator.search_placeholder')}</span>
            </motion.button>
            <LanguageSwitcher />
            <span className="hide-on-mobile"><AnimatedIcon href="https://www.instagram.com/lavanderianewshoes/"><Instagram size={22} strokeWidth={1.5} /></AnimatedIcon></span>
            <AnimatedIcon href={waHref}><WhatsAppIcon size={22} /></AnimatedIcon>
          </div>
        </motion.div>
      </nav>

      <FranchiseSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        unidades={unidades}
      />
    </>
  );
};

export default Navbar;

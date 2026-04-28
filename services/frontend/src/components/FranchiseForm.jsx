import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FranchiseForm = () => {
  const { t } = useTranslation();

  const inputStyle = {
    width: '100%',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    transition: '0.3s'
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = '#1CAAD9';
    e.target.style.backgroundColor = '#1a1a1a';
  }

  const blurStyle = (e) => {
    e.target.style.borderColor = '#333';
    e.target.style.backgroundColor = '#111';
  }

  return (
    <section id="franchise" style={{ backgroundColor: '#0a0a0a', color: '#fff', padding: 'clamp(60px, 10vw, 120px) 20px', position: 'relative' }}>

      <div style={{ position: 'absolute', right: 0, top: '20%', width: '300px', height: '600px', background: 'linear-gradient(to bottom, #1CAAD9, transparent)', opacity: 0.05, filter: 'blur(80px)' }} />

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1.2', marginBottom: '20px' }}>
            {t('franchise.title_prefix')} <br />
            <span style={{ color: '#1CAAD9' }}>{t('franchise.title_highlight')}</span>
          </h2>
          <p style={{ color: '#666', fontSize: '18px' }}>{t('franchise.subtitle')}</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
            <input type="text" placeholder={t('franchise.name')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            <input type="text" placeholder={t('franchise.lastname')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <input type="email" placeholder={t('franchise.email')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          <input type="tel" placeholder={t('franchise.whatsapp')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '20px' }}>
            <input type="text" placeholder={t('franchise.city')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            <input type="text" placeholder={t('franchise.state')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>

          <select style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle} defaultValue="">
            <option value="" disabled>{t('franchise.investment_label')}</option>
            <option value="220-250">{t('franchise.investment_option1')}</option>
            <option value="250-300">{t('franchise.investment_option2')}</option>
            <option value="300+">{t('franchise.investment_option3')}</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#fff', color: '#000' }}
            whileTap={{ scale: 0.98 }}
            type="button"
            style={{
              backgroundColor: '#1CAAD9',
              color: '#fff',
              padding: '25px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '20px',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '1px'
            }}
          >
            {t('franchise.submit')}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '30px' }}>
          {t('franchise.privacy')}
        </p>

      </div>
    </section>
  );
};

export default FranchiseForm;

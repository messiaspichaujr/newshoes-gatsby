import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

const languageLabels = {
  'pt-BR': 'PT',
  'en-US': 'EN',
  'es-ES': 'ES',
};

const LanguageSwitcher = () => {
  const { languages, language, changeLanguage } = useI18next();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {languages.map((lng, index) => (
        <React.Fragment key={lng}>
          <button
            onClick={(e) => {
              e.preventDefault();
              changeLanguage(lng);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: language === lng ? '800' : '500',
              color: language === lng ? '#1CAAD9' : '#666',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.5px',
              textDecoration: language === lng ? 'underline' : 'none',
              textUnderlineOffset: '3px',
              transition: 'color 0.2s',
            }}
            aria-label={`Switch language to ${languageLabels[lng]}`}
            aria-current={language === lng ? 'true' : undefined}
          >
            {languageLabels[lng] || lng}
          </button>
          {index < languages.length - 1 && (
            <span style={{ color: '#ccc', fontSize: '12px', userSelect: 'none' }} aria-hidden="true">|</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.mensagem) {
      setError(t('contact.error.required'));
      return;
    }

    try {
      setLoading(true);
      console.log('Mensagem enviada:', formData);
      setSubmitted(true);
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(t('contact.error.send'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: 'clamp(40px, 8vw, 80px) 20px', background: 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)' }} id="sac">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 60px)' }}>
          <h2 style={{ fontSize: 'clamp(24px, 5vw, 42px)', fontWeight: '700', color: '#000', margin: '0 0 10px 0' }}>{t('contact.title')}</h2>
          <p style={{ fontSize: 'clamp(14px, 3vw, 18px)', color: '#666', margin: '0' }}>{t('contact.subtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '32px', alignItems: 'start' }}>
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            {submitted && (
              <div style={{ padding: '16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', fontSize: '14px', background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
                {t('contact.success')}
              </div>
            )}

            {error && (
              <div style={{ padding: '16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', fontSize: '14px', background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                ❌ {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="nome" style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>{t('contact.field.name')} *</label>
                <input
                  type="text" id="nome" name="nome" value={formData.nome}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.name')}
                  required disabled={loading}
                  style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', transition: 'all 0.3s ease', background: '#fafafa' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>{t('contact.field.email')} *</label>
                <input
                  type="email" id="email" name="email" value={formData.email}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.email')}
                  required disabled={loading}
                  style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', transition: 'all 0.3s ease', background: '#fafafa' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="telefone" style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>{t('contact.field.phone')}</label>
                <input
                  type="tel" id="telefone" name="telefone" value={formData.telefone}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.phone')}
                  disabled={loading}
                  style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', transition: 'all 0.3s ease', background: '#fafafa' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="assunto" style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>{t('contact.field.subject')}</label>
                <input
                  type="text" id="assunto" name="assunto" value={formData.assunto}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.subject')}
                  disabled={loading}
                  style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', transition: 'all 0.3s ease', background: '#fafafa' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="mensagem" style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>{t('contact.field.message')} *</label>
              <textarea
                id="mensagem" name="mensagem" value={formData.mensagem}
                onChange={handleInputChange} placeholder={t('contact.placeholder.message')}
                rows="6" required disabled={loading}
                style={{ padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', transition: 'all 0.3s ease', background: '#fafafa', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', marginTop: '10px', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? t('contact.sending') : t('contact.submit')}
            </button>
          </form>

          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 30px 0' }}>{t('contact.side.title')}</h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <span style={{ fontSize: '28px', minWidth: '40px', textAlign: 'center' }}>📧</span>
              <div>
                <strong style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '5px' }}>{t('contact.side.email_label')}</strong>
                <p style={{ margin: '0', fontSize: '14px', opacity: 0.95, lineHeight: 1.5 }}>
                  <a href="mailto:contato@newshoes.com.br" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>contato@newshoes.com.br</a>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <span style={{ fontSize: '28px', minWidth: '40px', textAlign: 'center' }}>💬</span>
              <div>
                <strong style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '5px' }}>{t('contact.side.whatsapp_label')}</strong>
                <p style={{ margin: '0', fontSize: '14px', opacity: 0.95, lineHeight: 1.5 }}>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>(11) 99999-9999</a>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '0' }}>
              <span style={{ fontSize: '28px', minWidth: '40px', textAlign: 'center' }}>🕐</span>
              <div>
                <strong style={{ display: 'block', fontWeight: '600', fontSize: '14px', marginBottom: '5px' }}>{t('contact.side.hours_label')}</strong>
                <p style={{ margin: '0', fontSize: '14px', opacity: 0.95, lineHeight: 1.5 }}>{t('contact.side.hours')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

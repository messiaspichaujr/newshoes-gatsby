import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Mail, MessageCircle, Clock } from 'lucide-react';

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
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '14px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    color: '#000',
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#555',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.3px',
  };

  return (
    <section
      id="sac"
      style={{
        padding: 'clamp(60px, 10vw, 120px) 20px',
        background: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 60px)' }}
        >
          <h2 style={{
            fontFamily: "'StretchPro', sans-serif",
            fontSize: 'clamp(24px, 5vw, 42px)',
            color: '#000',
            marginBottom: '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            {t('contact.title')}
          </h2>
          <p style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            color: '#666',
            fontFamily: 'Inter, sans-serif',
            margin: 0,
          }}>
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
          gap: '32px',
          alignItems: 'start',
        }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#fff',
              padding: 'clamp(24px, 4vw, 40px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
            }}
          >
            {submitted && (
              <div style={{
                padding: '16px', borderRadius: '14px', marginBottom: '20px',
                fontWeight: '500', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                background: 'rgba(28,170,217,0.1)', color: '#1CAAD9',
                border: '1px solid rgba(28,170,217,0.2)',
              }}>
                {t('contact.success')}
              </div>
            )}

            {error && (
              <div style={{
                padding: '16px', borderRadius: '14px', marginBottom: '20px',
                fontWeight: '500', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                background: 'rgba(220,38,38,0.1)', color: '#dc2626',
                border: '1px solid rgba(220,38,38,0.2)',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="nome" style={labelStyle}>{t('contact.field.name')} *</label>
                <input type="text" id="nome" name="nome" value={formData.nome}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.name')}
                  required disabled={loading} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="email" style={labelStyle}>{t('contact.field.email')} *</label>
                <input type="email" id="email" name="email" value={formData.email}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.email')}
                  required disabled={loading} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="telefone" style={labelStyle}>{t('contact.field.phone')}</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.phone')}
                  disabled={loading} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="assunto" style={labelStyle}>{t('contact.field.subject')}</label>
                <input type="text" id="assunto" name="assunto" value={formData.assunto}
                  onChange={handleInputChange} placeholder={t('contact.placeholder.subject')}
                  disabled={loading} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="mensagem" style={labelStyle}>{t('contact.field.message')} *</label>
              <textarea id="mensagem" name="mensagem" value={formData.mensagem}
                onChange={handleInputChange} placeholder={t('contact.placeholder.message')}
                rows="5" required disabled={loading}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(28,170,217,0.3)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '16px',
                background: '#1CAAD9', color: '#fff',
                border: 'none', borderRadius: '14px',
                fontWeight: '700', fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '1px', textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Send size={18} />
              {loading ? t('contact.sending') : t('contact.submit')}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#000',
              padding: 'clamp(24px, 4vw, 40px)',
              borderRadius: '24px',
              color: '#fff',
            }}
          >
            <h3 style={{
              fontFamily: "'StretchPro', sans-serif",
              fontSize: 'clamp(18px, 3vw, 24px)',
              margin: '0 0 32px 0',
              letterSpacing: '1px',
            }}>
              {t('contact.side.title')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'rgba(28,170,217,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Mail size={20} color="#1CAAD9" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px', color: 'rgba(255,255,255,0.5)' }}>
                    {t('contact.side.email_label')}
                  </strong>
                  <a href="mailto:contato@newshoes.com.br" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    contato@newshoes.com.br
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'rgba(28,170,217,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MessageCircle size={20} color="#1CAAD9" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px', color: 'rgba(255,255,255,0.5)' }}>
                    {t('contact.side.whatsapp_label')}
                  </strong>
                  <a href="https://wa.me/5547991180109" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    (47) 99118-0109
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'rgba(28,170,217,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Clock size={20} color="#1CAAD9" />
                </div>
                <div>
                  <strong style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '4px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px', color: 'rgba(255,255,255,0.5)' }}>
                    {t('contact.side.hours_label')}
                  </strong>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.85)' }}>
                    {t('contact.side.hours')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

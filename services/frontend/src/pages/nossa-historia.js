import React from 'react'
import { graphql, Link, navigate } from 'gatsby'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Award, Headset, GraduationCap, Cog, Cpu, TrendingUp, MapPin, MonitorCheck, Wrench, ShieldCheck, Zap, DollarSign } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/seo'
import '../css/global.css'
import '../css/BubbleMenu.css'

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const scatterRotations = [-6, 5, -4, 7, -5, 4]

const cardAnim = (i) => ({
  hidden: { scale: 0, rotate: scatterRotations[i] || 0, opacity: 0 },
  show: { scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
})

const NossaHistoriaPage = ({ data }) => {
  const { t } = useTranslation()
  const allUnidades = data.allStrapiUnidade?.nodes || []
  const unidades = allUnidades.filter(u => !u.locale || u.locale === 'pt-BR').length > 0
    ? allUnidades.filter(u => !u.locale || u.locale === 'pt-BR')
    : allUnidades

  const diferenciais = [
    { icon: <Award size={28} color="#1CAAD9" />, title: t('story.diff1.title'), desc: t('story.diff1.desc') },
    { icon: <Headset size={28} color="#1CAAD9" />, title: t('story.diff2.title'), desc: t('story.diff2.desc') },
    { icon: <GraduationCap size={28} color="#1CAAD9" />, title: t('story.diff3.title'), desc: t('story.diff3.desc') },
    { icon: <Cog size={28} color="#1CAAD9" />, title: t('story.diff4.title'), desc: t('story.diff4.desc') },
    { icon: <Cpu size={28} color="#1CAAD9" />, title: t('story.diff5.title'), desc: t('story.diff5.desc') },
    { icon: <TrendingUp size={28} color="#1CAAD9" />, title: t('story.diff6.title'), desc: t('story.diff6.desc') },
  ]

  const suportes = [
    { icon: <MapPin size={22} color="#1CAAD9" />, text: t('story.support1') },
    { icon: <MonitorCheck size={22} color="#1CAAD9" />, text: t('story.support2') },
    { icon: <Wrench size={22} color="#1CAAD9" />, text: t('story.support3') },
    { icon: <ShieldCheck size={22} color="#1CAAD9" />, text: t('story.support4') },
    { icon: <Zap size={22} color="#1CAAD9" />, text: t('story.support5') },
    { icon: <DollarSign size={22} color="#1CAAD9" />, text: t('story.support6') },
  ]

  return (
    <div className="app-wrapper">
      <Navbar unidades={unidades} />

      {/* ── Hero ── */}
      <section style={{
        paddingTop: '80px',
        background: 'linear-gradient(135deg, #000 0%, #0d1b2a 50%, #1a1a2e 100%)',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '800px' }}
        >
          <span style={{
            fontSize: '12px', fontWeight: '700', letterSpacing: '0.15em',
            color: '#1CAAD9', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
          }}>
            NEW SHOES
          </span>
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: '700', margin: '16px 0 20px',
            color: '#fff', lineHeight: 1.1,
          }}>
            {t('story.hero.title_prefix')}{' '}
            <span style={{ color: '#1CAAD9' }}>{t('story.hero.title_highlight')}</span>
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 20px)', color: 'rgba(255,255,255,0.6)',
            fontFamily: 'Inter, sans-serif', lineHeight: 1.6, margin: 0,
          }}>
            {t('story.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      {/* ── Origem ── */}
      <section style={{ backgroundColor: '#f5f5f5', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: '700', color: '#000', marginBottom: '32px',
          }}>
            {t('story.origin.title')}
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.9, color: '#444', marginBottom: '24px',
          }}>
            {t('story.origin.p1')}
          </p>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.9, color: '#444', marginBottom: '24px',
          }}>
            {t('story.origin.p2')}
          </p>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.9, color: '#444',
          }}>
            {t('story.origin.p3')}
          </p>
        </motion.div>
      </section>

      {/* ── Diferenciais ── */}
      <section style={{ backgroundColor: '#fff', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: '700', color: '#000', textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            {t('story.diff.title')}
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {diferenciais.map((d, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardAnim(i)}
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>{d.icon}</div>
                <h3 style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px', fontWeight: '700', color: '#000',
                  marginBottom: '10px',
                }}>
                  {d.title}
                </h3>
                <p style={{
                  fontSize: '14px', fontFamily: 'Inter, sans-serif',
                  color: '#666', lineHeight: 1.6, margin: 0,
                }}>
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Faca parte da mudanca ── */}
      <section style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 24px',
        background: 'linear-gradient(135deg, #000 0%, #0d1b2a 50%, #1a1a2e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '800px',
            padding: 'clamp(32px, 5vw, 60px)',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '30px',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: '700', marginBottom: '24px',
          }}>
            {t('story.movement.title')}
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.8, marginBottom: '40px',
            fontWeight: '300', color: 'rgba(255,255,255,0.8)',
          }}>
            {t('story.movement.text')}
          </p>
          <button
            onClick={() => navigate('/#franchise')}
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              backgroundColor: '#1CAAD9',
              color: '#fff',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '14px',
              letterSpacing: '1px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 20px rgba(28,170,217,0.4)',
            }}
          >
            {t('story.movement.cta')}
          </button>
        </motion.div>
      </section>

      {/* ── Estrutura de suporte ── */}
      <section style={{ backgroundColor: '#f5f5f5', padding: 'clamp(60px, 10vw, 120px) 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: '700', color: '#000', textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            {t('story.support.title')}
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{
              textAlign: 'center', color: '#666',
              fontSize: '16px', fontFamily: 'Inter, sans-serif',
              marginBottom: '48px', lineHeight: 1.6,
            }}
          >
            {t('story.support.subtitle')}
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '48px',
            }}
          >
            {suportes.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(28,170,217,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <span style={{
                  fontSize: '15px', fontFamily: 'Inter, sans-serif',
                  color: '#333', fontWeight: '500',
                }}>
                  {s.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA final */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 22px)',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '700', color: '#000',
              marginBottom: '24px',
            }}>
              {t('story.support.final_cta_text')}
            </p>
            <button
              onClick={() => navigate('/#franchise')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#25D366', color: '#fff',
                padding: '18px 40px', borderRadius: '50px',
                fontWeight: '700', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                transition: 'opacity 0.2s',
              }}
            >
              {t('story.support.final_cta')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export const Head = () => <Seo title="Nossa História — New Shoes" />

export default NossaHistoriaPage

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
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
`

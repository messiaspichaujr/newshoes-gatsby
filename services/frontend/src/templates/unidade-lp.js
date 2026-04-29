import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Instagram, Facebook, ArrowRight, CheckCircle2, Star, Shield, Clock, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/seo'
import '../css/global.css'
import '../css/BubbleMenu.css'

/* ─── Default prices (used when unit has no custom price set) ─── */
const DEFAULT_PRICES = {
  basic:       'R$ 59,90',
  express_plus:'R$ 79,90',
  pro:         'R$ 69,90',
  pro_plus:    'R$ 89,90',
  ultra:       'R$ 129,90',
}

const DEFAULT_ADDONS = [
  { key: 'impermeab',          nome: null, price: 'R$ 44,90' },
  { key: 'pintura',            nome: null, price: 'R$ 20,00' },
  { key: 'boost',              nome: null, price: 'R$ 69,90', note: 'unidade.repair.from' },
  { key: 'cabedal',            nome: null, price: 'R$ 79,90', note: 'unidade.repair.from' },
  { key: 'cabedal_couro',      nome: null, price: 'R$ 99,90', note: 'unidade.repair.from' },
  { key: 'couro_2cores',       nome: null, price: 'R$ 120,00', note: 'unidade.repair.from' },
  { key: 'midsole',            nome: null, price: 'R$ 79,90', note: 'unidade.repair.from' },
  { key: 'amarelado',          nome: null, price: 'R$ 29,90', note: 'unidade.repair.per_session' },
  { key: 'amarelado_2',        nome: null, price: 'R$ 29,90', note: 'unidade.repair.per_session' },
  { key: 'crease',             nome: null, price: 'R$ 24,90' },
  { key: 'remocao_tinta',      nome: null, price: 'R$ 30,00' },
  { key: 'retoque',            nome: null, price: 'R$ 34,90' },
  { key: 'camurca',            nome: null, price: 'R$ 34,90' },
]

const DEFAULT_PRODUCTS = [
  { key: 'cadarco_flat',       nome: null, price: 'R$ 14,90' },
  { key: 'meia_cano_alto',     nome: null, price: 'R$ 54,90' },
  { key: 'cadarco_color',      nome: null, price: 'R$ 24,90' },
  { key: 'cadarco_oval',       nome: null, price: 'R$ 14,90' },
  { key: 'cadarco_fat',        nome: null, price: 'R$ 19,90' },
  { key: 'camiseta',           nome: null, price: 'R$ 89,90' },
  { key: 'case_airpod',        nome: null, price: 'R$ 69,90' },
  { key: 'chaveiro_moto',      nome: null, price: 'R$ 14,90' },
  { key: 'chaveiro_tag',       nome: null, price: 'R$ 39,90' },
  { key: 'chaveiro_allstar',   nome: null, price: 'R$ 24,90' },
  { key: 'chaveiro_premium',   nome: null, price: 'R$ 49,90' },
  { key: 'chaverinho',         nome: null, price: 'R$ 49,90' },
  { key: 'meia',               nome: null, price: 'R$ 49,90' },
  { key: 'nave',               nome: null, price: 'R$ 24,90' },
  { key: 'odorizador',         nome: null, price: 'R$ 29,90' },
  { key: 'palmilha',           nome: null, price: 'R$ 44,90' },
  { key: 'palmilha_slim',      nome: null, price: 'R$ 19,90' },
  { key: 'pin',                nome: null, price: 'R$ 19,90' },
]

const buildPlans = (u) => [
  {
    key: 'basic',
    price: u.plano_basic_preco || DEFAULT_PRICES.basic,
    color: '#f0f9ff', border: '#bae6fd', badge: null,
    items: ['unidade.service.basic.item1', 'unidade.service.basic.item2'],
  },
  {
    key: 'pro',
    price: u.plano_pro_preco || DEFAULT_PRICES.pro,
    color: '#f0fdf4', border: '#bbf7d0', badge: null,
    items: ['unidade.service.pro.item1', 'unidade.service.pro.item2', 'unidade.service.pro.item3'],
  },
  {
    key: 'pro_plus',
    price: u.plano_pro_plus_preco || DEFAULT_PRICES.pro_plus,
    color: '#fefce8', border: '#fde047', badge: 'unidade.service.pro_plus.badge',
    items: ['unidade.service.pro_plus.item1', 'unidade.service.pro_plus.item2', 'unidade.service.pro_plus.item3'],
  },
  {
    key: 'ultra',
    price: DEFAULT_PRICES.ultra,
    color: '#fdf2f8', border: '#f9a8d4', badge: 'unidade.service.ultra.badge',
    items: ['unidade.service.ultra.item1', 'unidade.service.ultra.item2', 'unidade.service.ultra.item3', 'unidade.service.ultra.item4'],
  },
]

/* ─── Helpers ─── */
const waLink = (raw) => {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  return `https://wa.me/${digits.startsWith('55') ? digits : '55' + digits}`
}

const igLink = (raw) => {
  if (!raw) return null
  if (raw.startsWith('http')) return raw
  return `https://www.instagram.com/${raw.replace('@', '')}/`
}

/* ─── Component ─── */
const UnidadeLpPage = ({ data }) => {
  const { t } = useTranslation()
  const u = data.strapiUnidade
  const whatsappHref = waLink(u.whatsapp_sem_tracos || u.whatsapp)
  const plans = buildPlans(u)
  const repairs = u.reparos?.length > 0 ? u.reparos : DEFAULT_ADDONS
  const expressPrice = u.express_preco || DEFAULT_PRICES.express_plus
  const expressPlusPrice = u.express_plus_preco || DEFAULT_PRICES.express_plus
  const [floatingVisible, setFloatingVisible] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => setFloatingVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app-wrapper">
      <Navbar whatsapp={u.whatsapp_sem_tracos || u.whatsapp} />

      {/* ── Hero ── */}
      <section style={{
        paddingTop: '80px',
        background: 'linear-gradient(135deg, #000 0%, #1a1a2e 100%)',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px 0',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '48px',
          flexWrap: 'wrap',
        }}>
          {/* Left: text + badges + CTA */}
          <div style={{ flex: '1', minWidth: '280px', paddingBottom: '60px', color: '#fff' }}>
            <span style={{
              fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em',
              color: '#1CAAD9', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
            }}>
              {u.estado} — {u.cidade}
            </span>

            <h1 style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: '700', margin: '16px 0 12px', color: '#fff', lineHeight: 1.1,
            }}>
              {u.nome}
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.65)',
              margin: '0 0 28px', fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
            }}>
              {t('lp.hero.subtitle')}
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
              {[
                { Icon: Shield, key: 'lp.trust.abf' },
                { Icon: Star,   key: 'lp.trust.experience' },
                { Icon: Clock,  key: 'lp.trust.express' },
              ].map(({ Icon, key }) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '8px 14px', borderRadius: '50px',
                  fontSize: '12px', fontFamily: 'Inter, sans-serif',
                  color: 'rgba(255,255,255,0.85)',
                }}>
                  <Icon size={13} color="#1CAAD9" />
                  {t(key)}
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '12px',
                  backgroundColor: '#25D366', color: '#fff',
                  padding: '18px 40px', borderRadius: '50px',
                  fontWeight: '700', fontSize: '16px', fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(37,211,102,0.45)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.55)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.45)' }}
              >
                <WhatsAppIcon size={20} /> {t('unidade.cta')}
              </a>
            )}

            {u.endereco && (
              <p style={{
                marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <MapPin size={13} color="#1CAAD9" /> {u.endereco}
              </p>
            )}
          </div>

          {/* Right: store photo */}
          <div style={{
            flex: '0 0 auto',
            width: 'clamp(280px, 42%, 520px)',
            height: '380px',
            borderRadius: '20px 20px 0 0',
            overflow: 'hidden',
            boxShadow: '0 -8px 40px rgba(28,170,217,0.15)',
            alignSelf: 'flex-end',
            backgroundColor: '#111',
          }}>
            {u.imagem_url ? (
              <img
                src={u.imagem_url}
                alt={`Fachada ${u.nome}`}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center',
                  display: 'block',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 100%)',
              }}>
                <span style={{
                  fontFamily: 'Montserrat, sans-serif', fontSize: '32px', fontWeight: '700',
                  color: 'rgba(28,170,217,0.4)', letterSpacing: '0.1em',
                }}>NEW SHOES</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#F5F5F7', padding: 'clamp(32px, 6vw, 60px) clamp(16px, 3vw, 20px) clamp(60px, 10vw, 100px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* ── Contact card ── */}
          <div style={{
            backgroundColor: '#fff', borderRadius: '24px', padding: 'clamp(20px, 4vw, 40px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '48px',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: '#1CAAD9',
                  backgroundColor: 'rgba(28,170,217,0.1)', padding: '5px 12px',
                  borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {u.estado}
                </span>
                <h2 style={{
                  fontFamily: 'Montserrat, sans-serif', fontSize: '26px', fontWeight: '700',
                  marginTop: '14px', marginBottom: '4px', color: '#000',
                }}>
                  {u.nome}
                </h2>
                <p style={{ color: '#999', fontSize: '15px', margin: '0 0 24px' }}>{u.cidade}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {u.endereco && (
                    <ContactRow icon={<MapPin size={18} color="#1CAAD9" />}>{u.endereco}</ContactRow>
                  )}
                  {u.whatsapp && (
                    <ContactRow icon={<Phone size={18} color="#1CAAD9" />}>
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#555', textDecoration: 'none', fontWeight: '600' }}>
                        {u.whatsapp}
                      </a>
                    </ContactRow>
                  )}
                  {u.instagram && (
                    <ContactRow icon={<Instagram size={18} color="#1CAAD9" />}>
                      <a href={igLink(u.instagram)} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#555', textDecoration: 'none' }}>
                        {u.instagram.startsWith('http')
                          ? u.instagram.replace('https://www.instagram.com/', '@').replace(/\/$/, '')
                          : u.instagram}
                      </a>
                    </ContactRow>
                  )}
                  {u.facebook && (
                    <ContactRow icon={<Facebook size={18} color="#1CAAD9" />}>
                      <a href={u.facebook.startsWith('http') ? u.facebook : `https://facebook.com/${u.facebook}`}
                        target="_blank" rel="noopener noreferrer" style={{ color: '#555', textDecoration: 'none' }}>
                        Facebook
                      </a>
                    </ContactRow>
                  )}
                </div>
              </div>

              {/* Directions */}
              {u.endereco && (
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(u.endereco)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: '10px',
                    backgroundColor: '#f8f8f8', borderRadius: '16px',
                    padding: '28px 32px', textDecoration: 'none',
                    border: '1.5px solid #eee', minWidth: '180px',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#1CAAD9')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#eee')}
                >
                  <MapPin size={28} color="#1CAAD9" />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#333', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                    {t('unidade.directions')}
                  </span>
                  <ArrowRight size={14} color="#1CAAD9" />
                </a>
              )}
            </div>
          </div>

          {/* ── Urgency banner ── */}
          <div style={{
            backgroundColor: '#000', borderRadius: '16px',
            padding: '20px 32px', marginBottom: '48px',
            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
          }}>
            <Zap size={22} color="#1CAAD9" style={{ flexShrink: 0 }} />
            <p style={{
              flex: 1, margin: 0, color: '#fff', fontSize: '15px',
              fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
            }}>
              {t('lp.urgency')}
            </p>
            {whatsappHref && (
              <a
                href={whatsappHref} target="_blank" rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25D366', color: '#fff',
                  padding: '12px 24px', borderRadius: '50px',
                  fontWeight: '700', fontSize: '13px', fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {t('lp.urgency.cta')}
              </a>
            )}
          </div>

          {/* ── Cleaning plans ── */}
          <SectionTitle>{t('unidade.services.title')}</SectionTitle>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
            {t('unidade.services.subtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {plans.map(plan => (
              <div key={plan.key} style={{
                backgroundColor: plan.color, border: `1.5px solid ${plan.border}`,
                borderRadius: '20px', padding: '28px', position: 'relative',
              }}>
                {plan.badge && (
                  <span style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#1CAAD9', color: '#fff', fontSize: '11px', fontWeight: '700',
                    padding: '4px 14px', borderRadius: '20px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                  }}>
                    {t(plan.badge)}
                  </span>
                )}
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#000', fontFamily: 'Montserrat, sans-serif', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t(`unidade.service.${plan.key}.label`)}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '14px', color: '#444', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>{t(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Express */}
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '24px 32px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '48px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
              {t('unidade.service.express.group')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {['express', 'express_plus'].map(key => (
                <span key={key} style={{
                  backgroundColor: '#f0f9ff', color: '#000',
                  padding: '8px 20px', borderRadius: '20px',
                  fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif',
                  border: '1px solid #bae6fd',
                }}>
                  {t(`unidade.service.${key}.label`)}
                </span>
              ))}
            </div>
          </div>

          {whatsappHref && <CtaButton href={whatsappHref} label={t('unidade.cta')} />}

          {/* ── Small repairs ── */}
          <SectionTitle style={{ marginTop: '60px' }}>{t('unidade.repairs.title')}</SectionTitle>

          <div style={{
            backgroundColor: '#fff', borderRadius: '20px', padding: '28px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '40px',
            display: 'flex', flexWrap: 'wrap', gap: '10px',
          }}>
            {repairs.map((r, i) => (
              <span key={r.key || r.nome || i} style={{
                backgroundColor: '#f5f5f5', color: '#333',
                padding: '10px 18px', borderRadius: '50px',
                fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: '500',
                border: '1px solid #e5e7eb',
              }}>
                {r.nome || t(`unidade.repair.${r.key}`)}
              </span>
            ))}
          </div>

          {/* ── Products ── */}
          <SectionTitle style={{ marginTop: '60px' }}>{t('unidade.products.title')}</SectionTitle>

          <div style={{
            backgroundColor: '#fff', borderRadius: '20px', padding: '28px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '40px',
            display: 'flex', flexWrap: 'wrap', gap: '10px',
          }}>
            {DEFAULT_PRODUCTS.map((p, i) => (
              <span key={p.key} style={{
                backgroundColor: '#fefce8', color: '#333',
                padding: '10px 18px', borderRadius: '50px',
                fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: '500',
                border: '1px solid #fde047',
              }}>
                {p.nome || t(`unidade.product.${p.key}`)}
              </span>
            ))}
          </div>

          {whatsappHref && <CtaButton href={whatsappHref} label={t('unidade.cta')} />}

        </div>
      </section>

      <Footer />

      {/* ── Floating WhatsApp button ── */}
      {whatsappHref && floatingVisible && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
          style={{
            position: 'fixed', bottom: '28px', right: '28px', zIndex: 999,
            display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: '#25D366', color: '#fff',
            padding: '14px 22px', borderRadius: '50px',
            fontWeight: '700', fontSize: '14px', fontFamily: 'Inter, sans-serif',
            textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(37,211,102,0.5)',
            transition: 'transform 0.15s',
            animation: 'fadeInUp 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <WhatsAppIcon size={18} /> {t('lp.float.cta')}
        </a>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ─── Small helper components ─── */
const ContactRow = ({ icon, children }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
    <span style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</span>
    <span style={{ fontSize: '15px', color: '#555', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{children}</span>
  </div>
)

const SectionTitle = ({ children, style }) => (
  <h2 style={{
    fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '700',
    color: '#000', marginBottom: '12px', ...style,
  }}>
    {children}
  </h2>
)

const CtaButton = ({ href, label }) => (
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        backgroundColor: '#25D366', color: '#fff',
        padding: '18px 40px', borderRadius: '50px',
        fontWeight: '600', fontSize: '15px', fontFamily: 'Inter, sans-serif',
        textDecoration: 'none', boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <WhatsAppIcon /> {label}
    </a>
  </div>
)

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* ─── Gatsby ─── */
export const Head = ({ data }) => (
  <Seo title={`${data.strapiUnidade.nome} — New Shoes`} />
)

export default UnidadeLpPage

export const query = graphql`
  query ($id: String!, $language: String!) {
    strapiUnidade(id: { eq: $id }) {
      nome
      slug
      endereco
      whatsapp
      whatsapp_sem_tracos
      instagram
      facebook
      tiktok
      estado
      cidade
      imagem_url
      plano_basic_preco
      plano_pro_preco
      plano_pro_plus_preco
      express_preco
      express_plus_preco
      reparos
    }
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`

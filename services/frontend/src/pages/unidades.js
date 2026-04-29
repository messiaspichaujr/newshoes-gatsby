import React, { useState, useMemo } from 'react'
import { graphql, Link } from 'gatsby'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Building2, ArrowRight, ChevronDown, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/seo'
import '../css/global.css'
import '../css/BubbleMenu.css'

const UnidadesPage = ({ data }) => {
  const { t } = useTranslation();
  const allUnidades = data.allStrapiUnidade?.nodes || [];
  const [selectedState, setSelectedState] = useState('');

  const states = useMemo(
    () => [...new Set(allUnidades.map(u => u.estado).filter(Boolean))].sort(),
    [allUnidades]
  );

  const filtered = useMemo(() => {
    if (!selectedState) return allUnidades;
    return allUnidades.filter(u => u.estado === selectedState);
  }, [allUnidades, selectedState]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(u => {
      const state = u.estado || 'Outros';
      if (!groups[state]) groups[state] = [];
      groups[state].push(u);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="app-wrapper">
      <Navbar unidades={allUnidades} />

      {/* Hero */}
      <section style={{
        paddingTop: 'clamp(120px, 15vw, 200px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
        background: '#f5f5f5',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '400px', height: '400px', background: '#1CAAD9', filter: 'blur(180px)', opacity: 0.06, borderRadius: '50%', pointerEvents: 'none' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
            {t('locator.title')}
          </h1>
          <p style={{ color: '#666', fontSize: 'clamp(14px, 2.5vw, 18px)', marginBottom: '40px' }}>
            {allUnidades.length === 1 ? t('locator.results_singular') : t('locator.results_plural', { count: allUnidades.length })}
          </p>

          {/* Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedState('')}
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                border: !selectedState ? '2px solid #1CAAD9' : '1.5px solid #d1d1d1',
                backgroundColor: !selectedState ? 'rgba(28,170,217,0.08)' : '#fff',
                color: !selectedState ? '#1CAAD9' : '#555',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('locator.all_units')}
            </button>
            {states.map(state => (
              <button
                key={state}
                onClick={() => setSelectedState(selectedState === state ? '' : state)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '50px',
                  border: selectedState === state ? '2px solid #1CAAD9' : '1.5px solid #d1d1d1',
                  backgroundColor: selectedState === state ? 'rgba(28,170,217,0.08)' : '#fff',
                  color: selectedState === state ? '#1CAAD9' : '#555',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {state}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Units Grid */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) 20px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {grouped.map(([state, units], groupIdx) => (
            <div key={state} style={{ marginBottom: 'clamp(40px, 6vw, 60px)' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: groupIdx * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '24px', paddingLeft: '4px'
                }}
              >
                <MapPin size={20} color="#1CAAD9" />
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: '600', color: '#000', margin: 0 }}>
                  {state}
                </h2>
                <span style={{
                  fontSize: '12px', color: '#888', backgroundColor: '#e8e8e8',
                  padding: '4px 10px', borderRadius: '20px', fontWeight: '600'
                }}>
                  {units.length}
                </span>
              </motion.div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '24px'
              }}>
                {units.map((unit, i) => (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: '100%', height: '180px',
                      backgroundColor: '#1a1a2e', overflow: 'hidden', position: 'relative'
                    }}>
                      {unit.imagem_url ? (
                        <img
                          src={unit.imagem_url}
                          alt={unit.nome}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, #000 0%, #1a1a2e 100%)'
                        }}>
                          <span style={{
                            fontFamily: 'Montserrat, sans-serif', fontSize: '24px', fontWeight: '700',
                            color: 'rgba(28,170,217,0.5)', letterSpacing: '0.1em'
                          }}>NEW SHOES</span>
                        </div>
                      )}
                      <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        fontSize: '11px', fontWeight: '700', color: '#fff',
                        backgroundColor: '#1CAAD9',
                        padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase',
                        letterSpacing: '0.06em'
                      }}>
                        {unit.estado}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '20px', fontWeight: '600', color: '#000', margin: '0 0 4px' }}>
                        {unit.nome}
                      </h3>
                      <p style={{ color: '#999', fontSize: '14px', margin: '0 0 16px' }}>{unit.cidade}</p>

                      {unit.endereco && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <MapPin size={16} color="#1CAAD9" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ fontSize: '14px', color: '#555', lineHeight: '1.4' }}>{unit.endereco}</span>
                        </div>
                      )}
                      {unit.whatsapp && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                          <Phone size={16} color="#1CAAD9" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '14px', color: '#555' }}>{unit.whatsapp}</span>
                        </div>
                      )}

                      <Link
                        to={`/unidades/${unit.slug}`}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '14px 18px',
                          backgroundColor: '#000', color: '#fff',
                          borderRadius: '14px', textDecoration: 'none',
                          fontSize: '13px', fontWeight: '600',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1CAAD9')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000')}
                      >
                        {t('locator.view_store')} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export const Head = () => <Seo title="Nossas Unidades | New Shoes" />

export default UnidadesPage;

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
      }
    }
  }
`;

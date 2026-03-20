import React, { useState } from 'react';
import { MapPin, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FranchiseLocator = ({ unidades = [] }) => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('');

  const states = [...new Set(unidades.map(u => u.estado).filter(Boolean))].sort();

  const filtered = selectedState === ''
    ? unidades
    : unidades.filter(u => u.estado === selectedState);

  return (
    <section id="locator" style={{ padding: '100px 20px', backgroundColor: '#F5F5F7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '42px', fontWeight: '700', marginBottom: '10px', color: '#000' }}>
            {t('locator.title')}
          </h2>
          <p style={{ color: '#666', fontSize: '18px' }}>{t('locator.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px', position: 'relative' }}>
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #d1d1d1',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
                color: '#000',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <option value="">{t('locator.all_units')}</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <ChevronDown
              size={20}
              color="#000"
              style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
        </div>

        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}
        >
          <AnimatePresence mode='popLayout'>
            {filtered.length > 0 ? (
              filtered.map(unit => (
                <motion.div
                  key={unit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  style={{
                    backgroundColor: '#fff',
                    padding: '40px',
                    borderRadius: '24px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    border: '1px solid #fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#1CAAD9',
                        backgroundColor: 'rgba(28, 170, 217, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        textTransform: 'uppercase'
                      }}>
                        {unit.estado}
                      </span>
                      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: 'bold', marginTop: '15px', color: '#000' }}>
                        {unit.nome}
                      </h3>
                      <p style={{ color: '#999', fontSize: '14px', marginTop: '5px' }}>{unit.cidade}</p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', color: '#555', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {unit.endereco && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <MapPin size={20} color="#1CAAD9" />
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>{unit.endereco}</span>
                      </div>
                    )}
                    {unit.whatsapp && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Phone size={20} color="#1CAAD9" />
                        <span style={{ fontSize: '15px', fontWeight: '500' }}>{unit.whatsapp}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={`/unidades/${unit.slug}`}
                    style={{
                      marginTop: 'auto',
                      backgroundColor: '#000',
                      color: '#fff',
                      padding: '18px',
                      borderRadius: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'Inter, sans-serif',
                      textDecoration: 'none'
                    }}
                  >
                    {t('locator.view_store')} <ArrowRight size={18} />
                  </a>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#999' }}
              >
                <p>{t('locator.no_results')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default FranchiseLocator;

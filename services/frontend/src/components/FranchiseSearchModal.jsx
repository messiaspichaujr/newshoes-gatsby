import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, navigate } from 'gatsby';
import { MapPin, Search, X, Building2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FranchiseSearchModal = ({ isOpen, onClose, unidades = [] }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [drilldown, setDrilldown] = useState(null);
  const inputRef = useRef(null);

  const allStates = useMemo(
    () => [...new Set(unidades.map(u => u.estado).filter(Boolean))].sort(),
    [unidades]
  );

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();

    const stateMatches = allStates
      .filter(s => s.toLowerCase().includes(q))
      .slice(0, 3)
      .map(s => ({ type: 'estado', label: s }));

    const cityMap = new Map();
    unidades.forEach(u => {
      if (u.cidade?.toLowerCase().includes(q) && !cityMap.has(u.cidade)) {
        cityMap.set(u.cidade, u.estado);
      }
    });
    const cityMatches = [...cityMap.entries()].slice(0, 5).map(([cidade, estado]) => ({
      type: 'cidade',
      label: estado ? `${cidade} — ${estado}` : cidade,
      cidade,
      estado,
    }));

    const franquiaMatches = unidades
      .filter(u => u.nome?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(u => ({ type: 'franquia', label: u.nome, slug: u.slug, cidade: u.cidade, estado: u.estado }));

    return [...stateMatches, ...cityMatches, ...franquiaMatches];
  }, [query, unidades, allStates]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setDrilldown(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'franquia') {
      onClose();
      navigate(`/unidades/${suggestion.slug}`);
      return;
    }
    if (suggestion.type === 'cidade') {
      const results = unidades.filter(u => u.cidade === suggestion.cidade);
      setDrilldown({ label: suggestion.cidade, results });
      setQuery(suggestion.cidade);
    } else if (suggestion.type === 'estado') {
      const results = unidades.filter(u => u.estado === suggestion.label);
      setDrilldown({ label: suggestion.label, results });
      setQuery(suggestion.label);
    }
  };

  const typeLabel = (type) => {
    if (type === 'estado') return t('locator.type_estado');
    if (type === 'cidade') return t('locator.type_cidade');
    return t('locator.type_franquia');
  };

  const SuggestionIcon = ({ type }) => {
    if (type === 'estado') return <MapPin size={16} color="#1CAAD9" />;
    if (type === 'cidade') return <MapPin size={16} color="#666" />;
    return <Building2 size={16} color="#666" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 'clamp(80px, 15vh, 160px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(600px, calc(100vw - 40px))',
              backgroundColor: '#fff',
              borderRadius: '24px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search input */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #f0f0f0',
              gap: '12px'
            }}>
              <Search size={20} color="#999" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setDrilldown(null); }}
                placeholder={t('locator.search_placeholder')}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '16px', fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'transparent', color: '#000'
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#aaa', display: 'flex', alignItems: 'center',
                  padding: '4px', borderRadius: '50%'
                }}
                whileHover={{ backgroundColor: '#f0f0f0' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {/* Suggested franchises — shown when no query */}
              {!drilldown && query.length < 2 && unidades.length > 0 && (
                <div>
                  <div style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#fafafa'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {t('locator.all_units')}
                    </span>
                  </div>
                  {unidades.slice(0, 6).map((unit, i) => (
                    <Link
                      key={unit.id || i}
                      to={`/unidades/${unit.slug}`}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 20px',
                        borderBottom: i < Math.min(6, unidades.length) - 1 ? '1px solid #f5f5f5' : 'none',
                        textDecoration: 'none', color: '#1a1a1a',
                        transition: 'background 0.12s', backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Building2 size={18} color="#1CAAD9" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {unit.nome}
                        </p>
                        {unit.cidade && unit.estado && (
                          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#999' }}>
                            {unit.cidade} — {unit.estado}
                          </p>
                        )}
                      </div>
                      <ArrowRight size={16} color="#ccc" style={{ flexShrink: 0 }} />
                    </Link>
                  ))}
                  <Link
                    to="/unidades"
                    onClick={onClose}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', padding: '14px 20px',
                      textDecoration: 'none', color: '#1CAAD9',
                      fontSize: '14px', fontWeight: '600',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'background 0.12s', backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {t('locator.view_all')} <ArrowRight size={16} />
                  </Link>
                </div>
              )}

              {/* Drilldown results */}
              {drilldown && (
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px', borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#fafafa'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {drilldown.results.length} {drilldown.results.length === 1 ? t('locator.results_singular_short') : t('locator.results_plural_short')} — {drilldown.label}
                    </span>
                    <button onClick={() => { setDrilldown(null); setQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}>
                      <X size={16} />
                    </button>
                  </div>
                  {drilldown.results.map((unit, i) => (
                    <Link
                      key={unit.id || i}
                      to={`/unidades/${unit.slug}`}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px 20px',
                        borderBottom: i < drilldown.results.length - 1 ? '1px solid #f5f5f5' : 'none',
                        textDecoration: 'none', color: '#1a1a1a',
                        transition: 'background 0.12s', backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Building2 size={18} color="#1CAAD9" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {unit.nome}
                        </p>
                        {unit.cidade && unit.estado && (
                          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#999' }}>
                            {unit.cidade} — {unit.estado}
                          </p>
                        )}
                      </div>
                      <ArrowRight size={16} color="#ccc" style={{ flexShrink: 0 }} />
                    </Link>
                  ))}
                </div>
              )}

              {/* Autocomplete suggestions */}
              {!drilldown && suggestions.length > 0 && query.length >= 2 && suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', padding: '14px 20px',
                    border: 'none',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                    backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <SuggestionIcon type={s.type} />
                  <span style={{ flex: 1, fontSize: '15px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontSize: '11px', color: '#888', backgroundColor: '#f0f0f0',
                    padding: '3px 9px', borderRadius: '10px', fontFamily: 'Inter, sans-serif', flexShrink: 0,
                  }}>
                    {typeLabel(s.type)}
                  </span>
                </button>
              ))}

              {/* Empty state */}
              {!drilldown && query.length >= 2 && suggestions.length === 0 && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#aaa' }}>
                  <p style={{ fontSize: '14px' }}>
                    {t('locator.no_results')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FranchiseSearchModal;

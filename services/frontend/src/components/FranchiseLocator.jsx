import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'gatsby';
import { MapPin, Phone, ArrowRight, Search, X, ChevronDown, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FranchiseLocator = ({ unidades = [] }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [committed, setCommitted] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  // Drill-down: franchises shown inline below the search after clicking city/state
  const [drilldown, setDrilldown] = useState(null); // { label, results }
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const allStates = useMemo(
    () => [...new Set(unidades.map(u => u.estado).filter(Boolean))].sort(),
    [unidades]
  );

  const citiesForState = useMemo(() => {
    const source = selectedState
      ? unidades.filter(u => u.estado === selectedState)
      : unidades;
    return [...new Set(source.map(u => u.cidade).filter(Boolean))].sort();
  }, [unidades, selectedState]);

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

  // Filtered results (only used when user hits "Buscar" or uses the progressive filters)
  const filtered = useMemo(() => {
    let result = unidades;
    if (selectedState) result = result.filter(u => u.estado === selectedState);
    if (selectedCity) result = result.filter(u => u.cidade === selectedCity);
    const activeQuery = query || committed;
    if (activeQuery && !selectedState && !selectedCity) {
      const q = activeQuery.toLowerCase();
      result = result.filter(
        u =>
          u.nome?.toLowerCase().includes(q) ||
          u.cidade?.toLowerCase().includes(q) ||
          u.estado?.toLowerCase().includes(q) ||
          u.endereco?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [unidades, selectedState, selectedCity, query, committed]);

  useEffect(() => {
    const handleClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = () => {
    setCommitted(query);
    setDrilldown(null);
    setHasInteracted(true);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = suggestion => {
    setShowSuggestions(false);

    if (suggestion.type === 'franquia') {
      window.location.href = `/unidades/${suggestion.slug}`;
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

  const handleClear = () => {
    setQuery('');
    setCommitted('');
    setSelectedState('');
    setSelectedCity('');
    setDrilldown(null);
    setHasInteracted(false);
    inputRef.current?.focus();
  };

  const closeDrilldown = () => {
    setDrilldown(null);
    setQuery('');
  };

  const handleStateChange = state => {
    setSelectedState(state);
    setSelectedCity('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') { setShowSuggestions(false); setDrilldown(null); }
  };

  const typeLabel = type => {
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
    <section id="locator" style={{ padding: '100px 20px', backgroundColor: '#F5F5F7' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '42px', fontWeight: '700', marginBottom: '10px', color: '#000' }}>
            {t('locator.title')}
          </h2>
          <p style={{ color: '#666', fontSize: '18px' }}>{t('locator.subtitle')}</p>
        </div>

        {/* Smart Search Input */}
        <div style={{ maxWidth: '680px', margin: '0 auto 40px' }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: '16px',
              border: '1.5px solid #d1d1d1',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              <Search size={20} color="#999" style={{ marginLeft: '20px', flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  const val = e.target.value;
                  setQuery(val);
                  setDrilldown(null);
                  setShowSuggestions(true);
                  if (val.length >= 2) setHasInteracted(true);
                }}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={t('locator.search_placeholder')}
                style={{
                  flex: 1,
                  padding: '20px 12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'transparent',
                  color: '#000',
                }}
              />
              {query && (
                <button
                  onClick={handleClear}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', color: '#aaa', display: 'flex', alignItems: 'center' }}
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={handleSearch}
                style={{
                  padding: '20px 28px',
                  backgroundColor: '#1CAAD9',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#18a0ce')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1CAAD9')}
              >
                {t('locator.search_button')}
              </button>
            </div>

            {/* Autocomplete suggestions */}
            <AnimatePresence>
              {showSuggestions && !drilldown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => handleSuggestionClick(s)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '14px 20px',
                        border: 'none',
                        borderBottom: i < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <SuggestionIcon type={s.type} />
                      <span style={{ flex: 1, fontSize: '15px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
                        {s.label}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#888',
                        backgroundColor: '#f0f0f0',
                        padding: '3px 9px',
                        borderRadius: '10px',
                        fontFamily: 'Inter, sans-serif',
                        flexShrink: 0,
                      }}>
                        {typeLabel(s.type)}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drill-down: franchise list for a city or state */}
            <AnimatePresence>
              {drilldown && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    overflow: 'hidden',
                    maxHeight: '360px',
                    overflowY: 'auto',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#fafafa',
                    position: 'sticky',
                    top: 0,
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {drilldown.results.length} {drilldown.results.length === 1 ? t('locator.results_singular_short') : t('locator.results_plural_short')} — {drilldown.label}
                    </span>
                    <button
                      onMouseDown={closeDrilldown}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center', padding: 0 }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Franchise rows */}
                  {drilldown.results.map((unit, i) => (
                    <Link
                      key={unit.id || i}
                      to={`/unidades/${unit.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px 20px',
                        borderBottom: i < drilldown.results.length - 1 ? '1px solid #f5f5f5' : 'none',
                        textDecoration: 'none',
                        color: '#1a1a1a',
                        transition: 'background 0.12s',
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Building2 size={18} color="#1CAAD9" style={{ flexShrink: 0, pointerEvents: 'none' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {unit.nome}
                        </p>
                        {unit.cidade && unit.estado && (
                          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#999', fontFamily: 'Inter, sans-serif' }}>
                            {unit.cidade} — {unit.estado}
                          </p>
                        )}
                      </div>
                      <ArrowRight size={16} color="#ccc" style={{ flexShrink: 0 }} />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progressive Filters — shown after hitting "Buscar" */}
        <AnimatePresence>
          {hasInteracted && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 40 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedState}
                    onChange={e => handleStateChange(e.target.value)}
                    style={{
                      padding: '10px 40px 10px 16px',
                      borderRadius: '50px',
                      border: selectedState ? '2px solid #1CAAD9' : '1.5px solid #d1d1d1',
                      backgroundColor: selectedState ? 'rgba(28,170,217,0.08)' : '#fff',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      color: selectedState ? '#1CAAD9' : '#555',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <option value="">{t('locator.all_states')}</option>
                    {allStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color={selectedState ? '#1CAAD9' : '#888'}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    style={{
                      padding: '10px 40px 10px 16px',
                      borderRadius: '50px',
                      border: selectedCity ? '2px solid #1CAAD9' : '1.5px solid #d1d1d1',
                      backgroundColor: selectedCity ? 'rgba(28,170,217,0.08)' : '#fff',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      color: selectedCity ? '#1CAAD9' : '#555',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <option value="">{t('locator.all_cities')}</option>
                    {citiesForState.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    color={selectedCity ? '#1CAAD9' : '#888'}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                </div>

                {(selectedState || selectedCity) && (
                  <button
                    onClick={() => { setSelectedState(''); setSelectedCity(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 18px',
                      borderRadius: '50px',
                      border: '1.5px solid #d1d1d1',
                      backgroundColor: '#fff',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      color: '#666',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={13} />
                    {t('locator.clear_filters')}
                  </button>
                )}
              </div>

              <p style={{ textAlign: 'center', marginTop: '16px', color: '#aaa', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                {filtered.length === 1
                  ? t('locator.results_singular')
                  : t('locator.results_plural', { count: filtered.length })}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards grid — only shown after the user hits "Buscar" */}
        {hasInteracted && <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px',
          }}
        >
          <AnimatePresence mode="popLayout">
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
                    borderRadius: '24px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Unit image */}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#1a1a2e',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}>
                    {unit.imagem_url ? (
                      <img
                        src={unit.imagem_url}
                        alt={unit.nome}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #000 0%, #1a1a2e 100%)',
                      }}>
                        <span style={{
                          fontFamily: 'Space Grotesk', fontSize: '28px', fontWeight: '800',
                          color: 'rgba(28,170,217,0.6)', letterSpacing: '0.1em',
                        }}>NEW SHOES</span>
                      </div>
                    )}
                    {/* Estado badge over image */}
                    <span style={{
                      position: 'absolute', top: '14px', left: '14px',
                      fontSize: '11px', fontWeight: '700', color: '#fff',
                      backgroundColor: '#1CAAD9',
                      padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {unit.estado}
                    </span>
                  </div>

                  <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                  <div>
                      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px', color: '#000' }}>
                        {unit.nome}
                      </h3>
                      <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>{unit.cidade}</p>
                  </div>

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', color: '#555', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
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

                  <Link
                    to={`/unidades/${unit.slug}`}
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
                      textDecoration: 'none',
                    }}
                  >
                    {t('locator.view_store')} <ArrowRight size={18} />
                  </Link>
                  </div>{/* end inner padding */}
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
        </motion.div>}

      </div>
    </section>
  );
};

export default FranchiseLocator;

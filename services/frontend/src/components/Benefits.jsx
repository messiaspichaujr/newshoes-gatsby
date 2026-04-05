import React from 'react';
import { Award, Headphones, BookOpen, Layers, Cpu, TrendingUp, Map, Layout, LayoutDashboard, CheckCircle, Star, Shield, Zap, Heart, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ICON_MAP = {
  Award, Headphones, BookOpen, Layers, Cpu, TrendingUp,
  Star, Shield, Zap, Heart, Globe, Users, Map, Layout, LayoutDashboard,
};

const DynamicIcon = ({ name, size = 32 }) => {
  const Icon = ICON_MAP[name] || Award;
  return <Icon size={size} />;
};

const Benefits = ({ home = {} }) => {
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  const strapiItems = home.benefits_items;
  const items = strapiItems && strapiItems.length > 0
    ? strapiItems.map(item => ({
        icon: <DynamicIcon name={item.icon_name} size={32} />,
        title: item.title,
        desc: item.description,
      }))
    : [
        { icon: <Award size={32} />, title: t('benefits.item1.title'), desc: t('benefits.item1.desc') },
        { icon: <Headphones size={32} />, title: t('benefits.item2.title'), desc: t('benefits.item2.desc') },
        { icon: <BookOpen size={32} />, title: t('benefits.item3.title'), desc: t('benefits.item3.desc') },
        { icon: <Layers size={32} />, title: t('benefits.item4.title'), desc: t('benefits.item4.desc') },
        { icon: <Cpu size={32} />, title: t('benefits.item5.title'), desc: t('benefits.item5.desc') },
        { icon: <TrendingUp size={32} />, title: t('benefits.item6.title'), desc: t('benefits.item6.desc') },
      ];

  return (
    <section id="benefits" style={{ padding: 'clamp(60px, 10vw, 120px) 20px', backgroundColor: '#f5f5f5', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}
        >
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '700', marginBottom: '10px' }}>
            {home.benefits_title
              ? home.benefits_title
              : <>{t('benefits.title_prefix')} <span style={{ color: '#1CAAD9' }}>{t('benefits.title_highlight')}</span></>}
          </h2>
          <p style={{ color: '#666', fontSize: '18px' }}>{home.benefits_subtitle || t('benefits.subtitle')}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '20px',
            marginBottom: 'clamp(50px, 10vw, 100px)'
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemAnim}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              style={{
                backgroundColor: '#fff',
                padding: 'clamp(20px, 4vw, 40px)',
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.05)',
                cursor: 'default'
              }}
            >
              <div style={{
                backgroundColor: '#1CAAD9',
                width: '60px', height: '60px',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', marginBottom: '20px'
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#888', lineHeight: '1.6' }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
            borderRadius: 'clamp(20px, 4vw, 40px)',
            padding: 'clamp(32px, 6vw, 80px)',
            color: '#fff',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '500px', height: '500px', background: '#1CAAD9', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />

          <div style={{ flex: 1, minWidth: 'min(100%, 280px)', zIndex: 1 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(22px, 4vw, 36px)', marginBottom: '30px' }}>
              {home.benefits_structure_title || t('benefits.structure_title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {(home.benefits_structure_items && home.benefits_structure_items.length > 0
                ? home.benefits_structure_items.map(s => s.text)
                : [t('benefits.structure1'), t('benefits.structure2'), t('benefits.structure3')]
              ).map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <CheckCircle color="#1CAAD9" size={20} />
                  <span style={{ fontSize: '18px' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 'min(100%, 280px)', zIndex: 1 }}>
            <p style={{ fontSize: '14px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {home.benefits_investment_label || t('benefits.investment_label')}
            </p>
            <motion.h2
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(40px, 8vw, 64px)', color: '#1CAAD9', fontWeight: '700', margin: '10px 0' }}
            >
              {home.benefits_investment_amount || t('benefits.investment_amount')}
            </motion.h2>
            <p style={{ fontSize: '16px', color: '#666' }}>
              {home.benefits_investment_estimate || t('benefits.investment_estimate')}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Benefits;

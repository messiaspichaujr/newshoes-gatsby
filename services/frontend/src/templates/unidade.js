import React from 'react'
import { graphql } from 'gatsby'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Instagram, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/seo'
import '../css/global.css'
import '../css/BubbleMenu.css'

const UnidadePage = ({ data }) => {
  const { t } = useTranslation()
  const u = data.strapiUnidade

  return (
    <div className="app-wrapper">
      <Navbar />
      <section style={{ paddingTop: '160px', paddingBottom: '80px', minHeight: '80vh', backgroundColor: '#F5F5F7' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <a href="/#locator" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1CAAD9', textDecoration: 'none', marginBottom: '40px', fontWeight: '600' }}>
            <ArrowLeft size={18} /> {t('locator.title')}
          </a>

          <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1CAAD9', backgroundColor: 'rgba(28, 170, 217, 0.1)', padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
              {u.estado}
            </span>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '36px', fontWeight: '700', marginTop: '15px', color: '#000' }}>
              {u.nome}
            </h1>
            <p style={{ color: '#999', fontSize: '16px', marginTop: '5px' }}>{u.cidade}</p>

            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '30px', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {u.endereco && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#555' }}>
                  <MapPin size={20} color="#1CAAD9" />
                  <span style={{ fontSize: '16px' }}>{u.endereco}</span>
                </div>
              )}
              {u.whatsapp && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#555' }}>
                  <Phone size={20} color="#1CAAD9" />
                  <a href={`https://wa.me/${u.whatsapp_sem_tracos}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px', color: '#555', textDecoration: 'none' }}>
                    {u.whatsapp}
                  </a>
                </div>
              )}
              {u.instagram && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#555' }}>
                  <Instagram size={20} color="#1CAAD9" />
                  <a href={u.instagram.startsWith('http') ? u.instagram : `https://www.instagram.com/${u.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px', color: '#555', textDecoration: 'none' }}>
                    {u.instagram}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export const Head = ({ data }) => <Seo title={data.strapiUnidade.nome} />

export default UnidadePage

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

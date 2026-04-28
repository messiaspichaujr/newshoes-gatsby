import * as React from "react"
import { graphql, Link } from "gatsby"
import { useTranslation } from "react-i18next"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Seo from "../components/seo"
import '../css/global.css'
import '../css/BubbleMenu.css'

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="app-wrapper">
      <Navbar />
      <section style={{ paddingTop: '160px', paddingBottom: '80px', minHeight: '60vh', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '48px', fontWeight: '700', color: '#000' }}>
          {t('404.title')}
        </h1>
        <p style={{ color: '#666', fontSize: '18px', marginTop: '20px' }}>
          {t('404.message')}
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '40px',
            backgroundColor: '#1CAAD9',
            color: '#fff',
            padding: '16px 32px',
            borderRadius: '16px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {t('404.back_home', 'Voltar ao início')}
        </Link>
      </section>
      <Footer />
    </div>
  );
}

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage

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
  }
`;

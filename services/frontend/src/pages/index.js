import React from 'react'
import { graphql } from 'gatsby'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Benefits from '../components/Benefits'
import BrandStory from '../components/BrandStory'
import CleaningGame from '../components/CleaningGame'
import FranchiseLocator from '../components/FranchiseLocator'
import FranchiseForm from '../components/FranchiseForm'
import Footer from '../components/Footer'
import Seo from '../components/seo'
import '../css/global.css'
import '../css/BubbleMenu.css'

const IndexPage = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const locale = pageContext.language || 'pt-BR';
  const allUnidades = data.allStrapiUnidade?.nodes || [];
  const unidades = allUnidades.filter(u => u.locale === locale);

  return (
    <div className="app-wrapper">
      <div style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
        {t('welcome_banner')}
      </div>
      <Navbar />
      <Hero />
      <Benefits />
      <BrandStory />
      <CleaningGame />
      <FranchiseLocator unidades={unidades} />
      <FranchiseForm />
      <Footer />
    </div>
  );
}

export const Head = () => <Seo title="New Shoes" />

export default IndexPage

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
        locale
      }
    }
  }
`;

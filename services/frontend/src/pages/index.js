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
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import Seo from '../components/seo'
import '../css/global.css'
import '../css/BubbleMenu.css'

const IndexPage = ({ data, pageContext }) => {
  const { t } = useTranslation();
  const locale = pageContext.language || 'pt-BR';
  const allUnidades = data.allStrapiUnidade?.nodes || [];
  const ptUnidades = allUnidades.filter(u => u.locale === 'pt-BR');
  const unidades = ptUnidades.length > 0 ? ptUnidades : allUnidades;
  const home = locale === 'pt-BR' ? (data.strapiHomePage || {}) : {};

  return (
    <div className="app-wrapper">
      <div style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
        {home.welcome_banner || t('welcome_banner')}
      </div>
      <Navbar />
      <Hero home={home} />
      <Benefits home={home} />
      <BrandStory home={home} />
      <CleaningGame />
      <FranchiseLocator unidades={unidades} />
      <FranchiseForm />
      <ContactForm />
      <Footer home={home} />
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
        imagem_url
        locale
      }
    }
    strapiHomePage {
      welcome_banner
      hero_title
      benefits_title
      benefits_subtitle
      benefits_items
      benefits_investment_label
      benefits_investment_amount
      benefits_investment_estimate
      benefits_structure_title
      benefits_structure_items
      brand_title_prefix
      brand_title_highlight
      brand_paragraph
      brand_cta
      footer_description
      footer_instagram_url
      footer_whatsapp
    }
  }
`;

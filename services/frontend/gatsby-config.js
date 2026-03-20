/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `New Shoes`,
    description: `New Shoes - Especialistas em lavagem e restauracao de tenis`,
    author: `@newshoes`,
    siteUrl: `https://newshoes.com`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/locales`,
        name: `locale`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`pt-BR`, `en-US`, `es-ES`],
        defaultLanguage: `pt-BR`,
        siteUrl: `https://newshoes.com`,
        generateDefaultLanguagePage: true,
        i18nextOptions: {
          interpolation: {
            escapeValue: false,
          },
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `New Shoes`,
        short_name: `NewShoes`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#1CAAD9`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`,
      },
    },
  ],
}

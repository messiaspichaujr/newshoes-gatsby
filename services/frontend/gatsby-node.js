const path = require("path")

const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ""
const LOCALES = ["pt-BR", "en-US", "es-ES"]

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type StrapiUnidade implements Node {
      nome: String
      slug: String
      endereco: String
      whatsapp: String
      whatsapp_sem_tracos: String
      instagram: String
      facebook: String
      tiktok: String
      estado: String
      cidade: String
      locale: String
      strapiId: Int
      documentId: String
    }
  `)
}

async function fetchUnidades(locale) {
  const url = `${STRAPI_URL}/api/unidades?locale=${locale}&pagination[pageSize]=100`
  const headers = {}
  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }
  const res = await fetch(url, { headers })
  const json = await res.json()
  return (json.data || []).map(u => ({ ...u, locale }))
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  for (const locale of LOCALES) {
    const unidades = await fetchUnidades(locale)
    unidades.forEach(u => {
      createNode({
        ...u,
        id: createNodeId(`StrapiUnidade-${u.documentId}-${locale}`),
        strapiId: u.id,
        internal: {
          type: "StrapiUnidade",
          contentDigest: createContentDigest(u),
        },
      })
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allStrapiUnidade {
        nodes {
          id
          slug
          locale
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const unidadeTemplate = path.resolve("./src/templates/unidade.js")

  result.data.allStrapiUnidade.nodes.forEach(unidade => {
    createPage({
      path: `/unidades/${unidade.slug}`,
      component: unidadeTemplate,
      context: {
        id: unidade.id,
        slug: unidade.slug,
        locale: unidade.locale,
      },
    })
  })
}

const path = require("path")

const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ""
const LOCALES = ["pt-BR", "en-US", "es-ES"]

exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type StrapiUnidade implements Node @dontInfer {
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
      imagem_url: String
      locale: String
      strapiId: Int
      documentId: String
      plano_basic_preco: String
      plano_pro_preco: String
      plano_pro_plus_preco: String
      express_preco: String
      express_plus_preco: String
      reparos: JSON
    }

    type StrapiHomePage implements Node @dontInfer {
      welcome_banner: String
      hero_title: String
      benefits_title: String
      benefits_subtitle: String
      benefits_items: JSON
      benefits_investment_label: String
      benefits_investment_amount: String
      benefits_investment_estimate: String
      benefits_structure_title: String
      benefits_structure_items: JSON
      brand_title_prefix: String
      brand_title_highlight: String
      brand_paragraph: String
      brand_cta: String
      footer_description: String
      footer_instagram_url: String
      footer_whatsapp: String
    }
  `)
}

async function fetchUnidades(locale) {
  const url = `${STRAPI_URL}/api/unidades?locale=${locale}&pagination[pageSize]=100&populate=reparos&fields[0]=nome&fields[1]=slug&fields[2]=endereco&fields[3]=whatsapp&fields[4]=whatsapp_sem_tracos&fields[5]=instagram&fields[6]=facebook&fields[7]=tiktok&fields[8]=estado&fields[9]=cidade&fields[10]=imagem_url&fields[11]=plano_basic_preco&fields[12]=plano_pro_preco&fields[13]=plano_pro_plus_preco&fields[14]=express_preco&fields[15]=express_plus_preco`
  const headers = {}
  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }
  try {
    const res = await fetch(url, { headers })
    const json = await res.json()
    return (json.data || []).map(u => ({ ...u, locale }))
  } catch (e) {
    console.warn(`Could not fetch unidades (${locale}) from Strapi:`, e.message)
    return []
  }
}

async function fetchHomePage() {
  const url = `${STRAPI_URL}/api/home-page?populate=*`
  const headers = {}
  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }
  try {
    const res = await fetch(url, { headers })
    const json = await res.json()
    return json.data || null
  } catch (e) {
    console.warn("Could not fetch home-page from Strapi:", e.message)
    return null
  }
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

  const homePage = await fetchHomePage()
  if (homePage) {
    createNode({
      ...homePage,
      id: createNodeId("StrapiHomePage"),
      internal: {
        type: "StrapiHomePage",
        contentDigest: createContentDigest(homePage),
      },
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

  const unidadeTemplate   = path.resolve("./src/templates/unidade.js")
  const unidadeLpTemplate = path.resolve("./src/templates/unidade-lp.js")

  result.data.allStrapiUnidade.nodes.forEach(unidade => {
    const ctx = { id: unidade.id, slug: unidade.slug, locale: unidade.locale }

    createPage({
      path: `/unidades/${unidade.slug}`,
      component: unidadeTemplate,
      context: ctx,
    })

    createPage({
      path: `/lp/unidades/${unidade.slug}`,
      component: unidadeLpTemplate,
      context: ctx,
    })
  })
}

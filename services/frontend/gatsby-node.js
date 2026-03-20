const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allWpPage {
        nodes {
          id
          uri
        }
      }
      allWpPost {
        nodes {
          id
          uri
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const pageTemplate = path.resolve("./src/templates/wp-page.js")
  const postTemplate = path.resolve("./src/templates/wp-post.js")

  result.data.allWpPage.nodes.forEach(page => {
    createPage({
      path: page.uri,
      component: pageTemplate,
      context: {
        id: page.id,
      },
    })
  })

  result.data.allWpPost.nodes.forEach(post => {
    createPage({
      path: post.uri,
      component: postTemplate,
      context: {
        id: post.id,
      },
    })
  })
}

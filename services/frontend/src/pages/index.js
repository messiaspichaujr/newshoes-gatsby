import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = ({ data }) => {
  const posts = data.allWpPost?.nodes || []

  return (
    <Layout>
      <h1>New Shoes</h1>
      <h2>Latest Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link to={post.uri}>
                <h3>{post.title}</h3>
              </Link>
              <p>{post.date}</p>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found. Make sure your WordPress instance is running.</p>
      )}
    </Layout>
  )
}

export const Head = () => <Seo title="Home" />

export const query = graphql`
  query {
    allWpPost(sort: { date: DESC }) {
      nodes {
        id
        title
        uri
        date(formatString: "MMMM DD, YYYY")
        excerpt
      }
    }
  }
`

export default IndexPage

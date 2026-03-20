import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const WpPost = ({ data: { wpPost } }) => {
  return (
    <Layout>
      <article>
        <h1>{wpPost.title}</h1>
        <p>{wpPost.date}</p>
        <div dangerouslySetInnerHTML={{ __html: wpPost.content }} />
      </article>
    </Layout>
  )
}

export const Head = ({ data: { wpPost } }) => <Seo title={wpPost.title} />

export const query = graphql`
  query WpPostById($id: String!) {
    wpPost(id: { eq: $id }) {
      title
      content
      date(formatString: "MMMM DD, YYYY")
    }
  }
`

export default WpPost

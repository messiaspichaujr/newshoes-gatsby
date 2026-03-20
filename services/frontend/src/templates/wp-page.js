import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const WpPage = ({ data: { wpPage } }) => {
  return (
    <Layout>
      <h1>{wpPage.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: wpPage.content }} />
    </Layout>
  )
}

export const Head = ({ data: { wpPage } }) => <Seo title={wpPage.title} />

export const query = graphql`
  query WpPageById($id: String!) {
    wpPage(id: { eq: $id }) {
      title
      content
    }
  }
`

export default WpPage

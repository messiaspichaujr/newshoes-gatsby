const React = require('react')

exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'pt-br' })
  setHeadComponents([
    React.createElement('link', {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
      key: 'favicon-svg',
    }),
  ])
}

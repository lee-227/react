/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "gatsby-plugin-create-client-paths",
      options: { prefixes: ["/app/*"] },
    },
    {
      resolve: "gatsby-source-list",
      options: { apiUrl: "https://conduit.productionready.io/api" },
    },
    "gatsby-plugin-article",
    "gatsby-disable-404",
  ],
}

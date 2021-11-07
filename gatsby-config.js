module.exports = {
  siteMetadata: {
    siteUrl: "https://30dots.io",
    title: "30DotsList.io - Curated list of Cardano projects by 30 Dots",
  },
  plugins: [
    "gatsby-plugin-sitemap",
    'gatsby-plugin-netlify',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("node-sass"),
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `30DotsList.io - Curated list of Cardano projects by 30 Dots`,
        icon: `static/resources/favicon.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          "@": require("path").resolve(__dirname, "src"),
        },
        extensions: ["js", "scss", "sass"],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.*\.svg$/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-html-attributes",
      options: {
        "data-theme": "dark",
      },
    },
  ],
}

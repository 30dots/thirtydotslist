module.exports = {
  siteMetadata: {
    siteUrl: "https://cardanolist.io",
    title: "CardanoList - Curated list of Cardano projects by Ray Network",
  },
  plugins: [
    "gatsby-plugin-sitemap",
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
        name: `CardanoList - Curated list of Cardano projects by Ray Network`,
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
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-41062113-24",
      },
    },
    {
      resolve: `gatsby-plugin-yandex-metrika`,
      options: {
        trackingId: "84720916",
        webvisor: true,
        trackHash: true,
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

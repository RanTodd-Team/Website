/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'RanTodd',
    titleTemplate: "%s - RanTodd",
    menuLinks: [
      {
        name: 'Home',
        link: '/'
      },
      {
        name: 'Leaderboard',
        link: '/leaderboard'
      },
      {
        name: 'About',
        link: '/about'
      }
    ]
  },
  plugins: [`gatsby-plugin-react-helmet`],
}

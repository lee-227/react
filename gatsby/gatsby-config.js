/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: "hello Gatsby",
    description: "description in gatsby-node.js",
    author: "gatsby",
  },
  /* Your site config here */
  plugins: [
    // 将本地 JSON 文件中的数据放入数据层需要用到两个插件.
    // gatsby-source-filesystem: 用于将本地文件中的数据添加至数据层.
    // gatsby-transformer-json：将原始JSON字符串转换为JavaScript对象
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "json",
        path: `${__dirname}/json/`,
      },
    },
    "gatsby-transformer-json",
    // gatsby-source-filesystem 将markdown文件数据放入数据层
    // gatsby-transformer-remark 将数据层中的原始 markdown 数据转换为对象形式
    // gatsby-remark-images: 处理 markdown 中的图片, 以便可以在生产环境中使用.
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "markdown",
        path: `${__dirname}/src/posts/`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: ["gatsby-remark-images"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "xml",
        path: `${__dirname}/xml/`,
      },
    },
    // gatsby-source-filesystem: 用于将本地文件信息添加至数据层.
    // gatsby-plugin-sharp: 提供本地图像的处理功能(调整图像尺寸, 压缩图像体积 等等).
    // gatsby-transformer-sharp: 将 gatsby-plugin-sharp 插件处理后的图像信息添加到数据层
    // gatsby-image: React 组件, 优化图像显示, 基于 gatsby-transformer-sharp 插件转化后的数据.    
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    // 从 strapi 获取数据
    // {
    //   resolve: "gatsby-source-strapi",
    //   options: {
    //     apiUrl: "localhost:1337",
    //     contentTypes: ["Post"],
    //   },
    // },
    {
      resolve: "gatsby-source-mystrapi",
      options: {
        apiUrl: "http://localhost:1337",
        contentTypes: ["Post", "Product"],
      },
    },
    "gatsby-transformer-xml",
    // gatsby-plugin-react-helmet react-helmet 是一个组件, 用于控制页面元数据. 这对于 SEO 非常重要.此插件用于将页面元数据添加到 Gatsby 构建的静态HTML页面中
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-less",
  ],
}

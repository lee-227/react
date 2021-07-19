## Gatsby 总览
1. 基于 React 和 GraphQL. 结合了 webpack, babel, react-router 等前端领域中最先进工具. 开发人员开发体验好
2. 采用数据层和UI层分离而不失 SEO 的现代前端开发模式. 对SEO非常友好
3. 数据预读取, 在浏览器空闲的时候预先读取链接对应的页面内容. 使静态页面拥有 SPA 应用的用户体验, 用户体验好
4. 数据来源多样化: Headless CMS, markdown, API.
5. 功能插件化, Gatsby 中提供了丰富且功能强大的各种类型的插件, 用什么装什么

## GraphQL 数据层
- 在 Gatsby 框架中提供了一个统一的存储数据的地方，叫做数据层.
- 在应用构建时，Gatsby 会从外部获取数据并将数据放入数据层，组件可以直接从数据层查询数据.
- 数据层使用 GraphQL 构建.
- 调试工具：localhost:8000/___graphql

## Gatsby 插件
- Gatsby 框架内置插件系统, 插件是为应用添加功能的最好的方式.
- 在 Gatsby 中有三种类型的插件: 分别为数据源插件 ( source ), 数据转换插件 ( transformer ), 功能插件 ( plugin )
- 数据源插件：负责从应用外部获取数据，将数据统一放在 Gatsby 的数据层中
- 数据转换插件：负责转换特定类型的数据的格式，比如将 markdown 文件中的内容转换为对象形式
- 功能插件：为应用提供功能，比如通过插件让应用支持 Less 或者 TypeScript

## 图像优化
- 未处理
1. 图像文件和数据文件不在源代码中的同一位置
2. 图像路径基于构建站点的绝对路径, 而不是相对于数据的路径, 难以分析出图片的真实位置
3. 图像没有经过任何优化操作
   
- 处理之后
1. 生成多个具有不同宽度的图像版本, 为图像设置 srcset 和 sizes 属性, 因此无论您的设备是什么宽度都可以加载到合适大小的图片
2. 使用"模糊处理"技术, 其中将一个20px宽的小图像显示为占位符, 直到实际图像下载完成为止

## Gatsby Source 插件开发
数据源插件负责从 Gatsby 应用外部获取数据，创建数据查询节点供开发者使用
1. gatsby clean 清除上一次的构建内容
2. 在项目根目录里下创建 plugins 文件夹，在此文件夹中继续创建具体的插件文件夹，比如 gatsby-source-mystrapi 文件夹
3. 在插件文件夹中创建 gatsby-node.js 文件
4. 插件实际上就是 npm 包
5. 导出 sourceNodes 方法用于获取外部数据，创建数据查询节点
6. 在 gatsby-config.js 文件中配置插件，并传递插件所需的配置参数
6. 重新运行应用

## Gatsby Transformer 插件开发
transformer 插件将 source 插件提供的数据转换为新的数据
1. 在 plugins 文件夹中创建 gatsby-transformer-xml 文件件
2. 在插件文件夹中创建 gatsby-node.js 文件
3. 在文件中导出 onCreateNode 方法用于构建 Gatsby 查询节点
4. 根据节点类型筛选 xml 节点 node.internal.mediaType -> application/xml
5. 通过 loadNodeContent 方法读取节点中的数据
6. 通过 xml2js 将xml数据转换为对象
7. 将对象转换为 Gatsby 查询节点
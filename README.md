# egg-type-graphql
## 参考[egg-graphql](https://github.com/eggjs/egg-graphql)

## 安装与配置

安装对应的依赖 [egg-type-graphql] ：

开启插件：

```js
// config/plugin.js
exports.graphql = {
  enable: true,
  package: '@ak/egg-type-graphql',
};
```

在 `config/config.${env}.js` 配置提供 graphql 的路由。

```js
// config/config.${env}.js
exports.graphql = {
  router: '/graphql',
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
  // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
  graphiql: true,
  //是否设置默认的Query和Mutation, 默认关闭
  defaultEmptySchema:true,
  // graphQL 路由前的拦截器
  onPreGraphQL: function* (ctx) {},
  // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
  onPreGraphiQL: function* (ctx) {},
  // apollo server的透传参数，参考[文档](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#parameters)
  apolloServerOptions: {
    rootValue,
    formatError,
    formatResponse,
    mocks,
    schemaDirectives,
    introspection,
    playground,
    debug,
    validationRules,
    tracing,
    cacheControl,
    subscriptions,
    engine,
    persistedQueries,
    cors,
  }
};

// 添加中间件拦截请求
exports.middleware = [ 'graphql' ];
```

## 使用方式

配合typeOrm使用


```
.
├── app
│   ├── graphql
│   │   │
│   │   ├── user  // 一个graphql模型
│   │   │   ├── connector.js
│   │   │   ├── resolver.js
│   │   ├── group //自定义模型组目录
│   │   │   ├── framework  // 一个graphql模型
│   │   │   │   ├── connector.js
│   │   │   │   ├── resolver.js
│   │   │   └── workspace  // 一个graphql模型
│   │   │       ├── connector.js
│   │   │       ├── resolver.js
│   ├── entity
│   │   └── user.js
│   ├── public
│   └── router.js

```

import { EggAppConfig, Context } from "egg"
import { Config } from "apollo-server-koa"

declare module "egg" {

	interface EggAppConfig {
		graphql: {
			router?: string,
			// 是否加载到 app 上，默认开启
			app?: boolean,
			// 是否加载到 agent 上，默认关闭
			agent?: false,
			// 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
			graphiql?: boolean,
			//是否设置默认的Query和Mutation, 默认关闭
			defaultEmptySchema?: boolean,
			// graphQL 路由前的拦截器
			onPreGraphQL?: (ctx: Context) => Generator,
			// 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
			onPreGraphiQL: (ctx: Context) => Generator,
			// apollo server的透传参数，参考[文档](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#parameters)
			apolloServerOptions?: Config
		}
	}
}
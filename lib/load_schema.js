'use strict';

// const fs = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');
require('reflect-metadata');
const { buildTypeDefsAndResolvers } = require('type-graphql');
const _ = require('lodash');

const SYMBOL_SCHEMA = Symbol('Applicaton#schema');
const util = require('./util');

module.exports = async app => {
  const basePath = path.join(app.baseDir, 'app/graphql');
  const types = util.walk(basePath, basePath);

  const schemas = [];
  const resolverMap = {};
  const resolverFactories = [];
  const directiveMap = {};
  const schemaDirectivesProps = {};
  const { defaultEmptySchema = false } = app.config.graphql;
  const defaultSchema = `
    type Query
    type Mutation
  `;
  if (defaultEmptySchema) {
    schemas.push(defaultSchema);
  }

  types.forEach(type => {
    // // Load schema
    // const schemaFile = path.join(basePath, type, 'schema.graphql');
    // /* istanbul ignore else */
    // if (fs.existsSync(schemaFile)) {
    //   const schema = fs.readFileSync(schemaFile, {
    //     encoding: 'utf8',
    //   });
    //   schemas.push(schema);
    // }
    // Load resolver
    const resolverFile = path.join(basePath, type, 'resolver');
    const resolver = util.getModule(resolverFile);
    if (_.isFunction(resolver)) {
      resolverFactories.push(resolver);
    } else if (_.isObject(resolver)) {
      _.merge(resolverMap, resolver);
    }

    // Load directive resolver
    const directiveFile = path.join(basePath, type, 'directive');
    const directive = util.getModule(directiveFile);
    if (directive) {
      _.merge(directiveMap, directive);
    }

    // Load schemaDirectives
    const schemaDirectivesFile = path.join(basePath, type, 'schemaDirective');
    const schemaDirectives = util.getModule(schemaDirectivesFile);
    if (schemaDirectives) {
      _.merge(schemaDirectivesProps, schemaDirectives);
    }
  });

  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: resolverFactories,
  });

  Object.defineProperty(app, 'schema', {
    get() {
      if (!this[SYMBOL_SCHEMA]) {
        // resolverFactories.forEach((resolverFactory) =>
        //   _.merge(resolverMap, resolverFactory(app))
        // );

        this[SYMBOL_SCHEMA] = makeExecutableSchema({
          typeDefs,
          resolvers,
          directiveResolvers: directiveMap,
          schemaDirectives: schemaDirectivesProps,
        });
      }
      return this[SYMBOL_SCHEMA];
    },
  });
};

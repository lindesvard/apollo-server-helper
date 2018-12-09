import { map, merge, endsWith, replace, capitalize } from 'lodash'
import { readdirSync } from 'fs'
import { resolve } from 'path'

const erase = (str, match) => replace(str, match, '')

export const generateResolvers = dir =>
  readdirSync(dir).reduce(
    (acc, file) => {
      if (file === 'index.js') {
        return acc
      }

      const module = require(resolve(dir, file)).default

      if (endsWith(file, '.query.js')) {
        return {
          ...acc,
          Query: { ...acc.Query, [erase(file, '.query.js')]: module },
        }
      }

      if (endsWith(file, '.mutation.js')) {
        return {
          ...acc,
          Mutation: {
            ...acc.Mutation,
            [erase(file, '.mutation.js')]: module,
          },
        }
      }

      if (endsWith(file, '.subscription.js')) {
        return {
          ...acc,
          Subscription: {
            ...acc.Subscription,
            [erase(file, '.subscription.js')]: module,
          },
        }
      }

      return {
        ...acc,
        [capitalize(erase(file, '.js'))]: module,
      }
    },
    {
      Mutation: {},
      Query: {},
      Subscription: {},
    }
  )

export const generateSchema = (dir, RootQuery, rootResolvers) => {
  const types = readdirSync(dir).map(file => require(resolve(dir, file)))

  return {
    typeDefs: [RootQuery, ...map(types, 'typeDef')],
    resolvers: merge(rootResolvers, ...map(types, 'resolvers')),
  }
}

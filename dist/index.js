'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSchema = exports.generateResolvers = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _fs = require('fs');

var _path = require('path');

var _capitalizeFirstLetter = require('./capitalizeFirstLetter');

var _capitalizeFirstLetter2 = _interopRequireDefault(_capitalizeFirstLetter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const erase = (str, match) => (0, _lodash.replace)(str, match, '');

const generateResolvers = exports.generateResolvers = dir => (0, _fs.readdirSync)(dir).reduce((acc, file) => {
  if (file === 'index.js') {
    return acc;
  }

  const module = require((0, _path.resolve)(dir, file)).default;

  if ((0, _lodash.endsWith)(file, '.query.js')) {
    return _extends({}, acc, {
      Query: _extends({}, acc.Query, { [erase(file, '.query.js')]: module })
    });
  }

  if ((0, _lodash.endsWith)(file, '.mutation.js')) {
    return _extends({}, acc, {
      Mutation: _extends({}, acc.Mutation, {
        [erase(file, '.mutation.js')]: module
      })
    });
  }

  if ((0, _lodash.endsWith)(file, '.subscription.js')) {
    return _extends({}, acc, {
      Subscription: _extends({}, acc.Subscription, {
        [erase(file, '.subscription.js')]: module
      })
    });
  }

  return _extends({}, acc, {
    [(0, _capitalizeFirstLetter2.default)(erase(file, '.js'))]: module
  });
}, {
  Mutation: {},
  Query: {},
  Subscription: {}
});

const generateSchema = exports.generateSchema = (dir, RootQuery, rootResolvers) => {
  const types = (0, _fs.readdirSync)(dir).map(file => require((0, _path.resolve)(dir, file)));

  return {
    typeDefs: [RootQuery, ...(0, _lodash.map)(types, 'typeDef')],
    resolvers: (0, _lodash.merge)(rootResolvers, ...(0, _lodash.map)(types, 'resolvers'))
  };
};
const express = require('express')
const cookieParser = require('cookie-parser')
const yaml = require('json2yaml')
const bodyParser = require('body-parser')
const jsYaml = require('js-yaml')

/**
 * Author: Jason Lin
 * Usage: you can pass the config object into factory or use standard 
 * express function to add route, like router.get()
 *   I.Config Object Schema:
 *      1. isYaml - boolean(optional): request and response format, which are default to json
 *      2. rules - array of object:
 *        a. method - string: http method name in [all, use, get, post, put, delete]
 *        b. url - string(optional): route path
 *        c. callBack - function(optional): callBack for this rule
 *        d. validateHeader - object(optional): properties are
 *          A. name: header name
 *          B. regex: regex to valid header
 *          C. error: throw the error if the validation is failed
 *        e. validateCookies - object(optional): the usage is as same as validateHeader
 *        f. removeQueryString - boolean(optional): remove the url query string it's true
 */

const methodMapping = {
  all: 'use',
  use: 'use',
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
}

const ConfigurableServerFactory = ({ isYaml = false, rules = [] }) => {
  const router = express.Router()

  const yamlMiddleWare = (req, res, next) => {
    if (isYaml) {
      const send = res.send
      res.send = (body) => {
        send.call(res, yaml.stringify(body))
      }
      req.body = jsYaml.safeLoad(req.body)
    }
    next()
  }

  router.use(cookieParser())
  if (isYaml) {
    router.use(bodyParser.text()) // input as yaml
  } else {
    router.use(bodyParser.json()) // input as json
  }
  router.use(yamlMiddleWare)

  rules.forEach((rule) => {
    const funcArray = []
    const { callBack, url = '*', removeQueryString, validateCookies, validateHeader } = rule
    const method = methodMapping[rule.method]
    if (!method) return

    if (validateHeader) {
      const { name, regex, error } = validateHeader
      const validateFunc = ({ headers }, res, next) => {
        console.log({
          headers,
          pass: regex.test(headers[name.toLowerCase()]),
        })
        if (regex.test(headers[name.toLowerCase()])) {
          next()
        } else {
          throw new Error(error)
        }
      }
      funcArray.push(validateFunc)
    }

    if (validateCookies) {
      const { name, regex, error } = validateCookies
      const validateCookiesFunc = ({ cookies }, res, next) => {
        if (!cookies[name] || regex.test(cookies[name])) {
          throw new Error(error)
        }
        next()
      }
      funcArray.push(validateCookiesFunc)
    }

    if (removeQueryString) {
      const removeQueryStringFunc = (req, res, next) => {
        const urls = req.originalUrl.split('?')
        if (urls.length > 1) {
          req.url = urls[0]
          req.originalUrl = urls[0]
        }
        next()
      }
      funcArray.push(removeQueryStringFunc)
    }

    if (callBack) {
      funcArray.push(callBack)
    }

    if (method === 'use') {
      router[method].apply(router, [url, ...funcArray])
    } else {
      router[method](url, funcArray)
    }
  })

  const handleError = (error, req, res, next) => {
    return res.status(500).send({ error: error.toString() })
  }

  router.use(handleError)

  return router
}

module.exports = ConfigurableServerFactory

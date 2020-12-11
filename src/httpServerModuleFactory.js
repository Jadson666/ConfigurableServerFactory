const express = require('express')
const cookieParser = require('cookie-parser')
const moment = require('moment')
const yaml = require('json2yaml')
const bodyParser = require('body-parser')
const jsYaml = require('js-yaml')

const BASE_PATH = '/shopback'

const httpServerModuleFactory = ({ isYaml = false, rules = [] }) => {
  const router = express.Router()

  const middleWare = (req, res, next) => {
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
  router.use(middleWare)

  rules.forEach((rule) => {
    const funcArray = []
    const { callBack, url, removeQueryString, validateCookies } = rule
    const method = rule.method === 'all' ? 'use' : rule.method
    if (rule.validateHeader) {
      const { name, regex, error } = rule.validateHeader
      const validateFunc = (req, res, next) => {
        if (regex.test(req.headers[name])) {
          next()
        } else {
          throw new Error(error)
        }
      }
      funcArray.push(validateFunc)
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

    if (validateCookies) {
      const { name, regex, error } = validateCookies
      const validateCookiesFunc = (req, res, next) => {
        if ( !req.cookies[name] || regex.test(req.cookies[name])) {
          throw new Error(error)
        }
        next()
      }
      funcArray.push(validateCookiesFunc)
    }

    if (callBack) {
      funcArray.push(callBack)
    }
    router[method](url || '*', method !== 'use' ? funcArray : funcArray[0]) // TODO: generalize the call
  })

  const handleError = (error, req, res, next) => {
    return res.status(500).send({ error: error.toString() })
  }

  router.get(`${BASE_PATH}/resource`, (req, res, next) => res.send(successObj))
  router.use(handleError)

  return router
}

module.exports = httpServerModuleFactory

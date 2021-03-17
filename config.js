const moment = require('moment')

const BASE_PATH = '/hello'
const FROM = 'hello@hello.com'
const TIME_STAMP_HEADER_NAME = 'X-HELLO-TIMESTAMP'
const AGENT_HEADER = 'X-HELLO-AGENT'
const DOMAIN_FROM = 'www.hello.com'
const VALID_COOKIE = 'hellocookie'
const SUCCESS_RESPONSE = { hello: 'yes i do' }

const config = {
  isYaml: true,
  rules: [
    {
      method: 'all',
      callBack: (req, res, next) => {
        res.set({ [TIME_STAMP_HEADER_NAME]: new moment().utc().format() })
        next()
      }
    },
    {
      method: 'all',
      validateHeader: {
        name: 'host',
        regex: new RegExp(`^(https://)?${DOMAIN_FROM}(/.*)?$`),
        error: `domain is incorrect!`
      }
    },
    {
      method: 'get',
      validateHeader: {
        name: 'referer',
        regex: new RegExp(`^(https://)?${DOMAIN_FROM}(/.*)?$`),
        error: 'referer header is incorrect!'
      }
    },
    {
      method: 'get',
      url: `${BASE_PATH}/me`,
      validateCookies: {
        name: VALID_COOKIE,
        regex: /.+/,
        error: `${VALID_COOKIE} is not exist!`,
      }
    },
    {
      method: 'get',
      url: `${BASE_PATH}/resource`,
      callBack: (req, res, next) => {
        req.url = req.url.replace(`${BASE_PATH}/resource`, `${BASE_PATH}/static/assets`)
        next()
      }
    },
    {
      method: 'get',
      url: `${BASE_PATH}/api/*`,
      callBack: (req, res, next) => {
        res.set({ From: FROM })
        next()
      },
    },
    {
      method: 'delete',
      validateHeader: {
        name: AGENT_HEADER,
        regex: /^AGENT_1$/,
        error: `${AGENT_HEADER} is incorrect!`
      }
    },
    {
      method: 'post',
      validateHeader: {
        name: AGENT_HEADER,
        regex: /.+/,
        error: `${AGENT_HEADER} is not exist!`
      },
      removeQueryString: true,
    },
    {
      method: 'post',
      validateHeader: {
        name: 'Content-Type',
        regex: /^application\/json$/,
        error: 'Content-Type is not exist or correct!'
      }
    },
    {
      method: 'put',
      validateHeader: {
        name: AGENT_HEADER,
        regex: /.+/,
        error: `${AGENT_HEADER} is not exist!`
      },
      removeQueryString: true,
    },
    {
      method: 'put',
      validateHeader: {
        name: 'Content-Type',
        regex: /^application\/json$/,
        error: 'Content-Type is not exist or correct!'
      }
    },
    {
      method: 'all',
      callBack: (req, res, next) => res.send(SUCCESS_RESPONSE)
    }
  ]
}

module.exports = config

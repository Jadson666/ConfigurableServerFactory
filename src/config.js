const BASE_PATH = '/shopback'

const successObj = { hello: 'yes i do' }

const FROM = 'hello@shopback.com'

const TIME_STAMP_HEADER_NAME = 'X-SHOPBACK-TIMESTAMP'

const AGENT_HEADER = 'X-SHOPBACK-AGENT'

const DOMAIN_FROM = 'www.shopback.com'

const VALID_COOKIE = 'sbcookie'

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
        error: 'Content-Type is not exist!'
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
        error: 'Content-Type is not exist!'
      }
    },
    {
      method: 'all',
      callBack: (req, res, next) => res.send(successObj)
    }
  ]
}

module.exports = config
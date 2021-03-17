# Project Goal
this is a demo project for backend architecture of **config base** http server
this project aim to make server route config more clear,

### Usage
you can pass the config object into `ConfigurableServerFactory` or use standard
express function to add route, like router.get()

#### config object schema:

1. Config Object Schema:
   1. `isYaml` - boolean(optional): request and response format, which are default to json
2. rules - array of object:
   1. `method` - string: http method name in [all, use, get, post, put, delete]
   2. `url` - string(optional): route path
   3. `callBack` - function(optional): callBack for this rule
   4. `validateHeader` - object(optional): properties are
      1. `name`: header name
      2. `regex`: regex to valid header
      3. `error`: throw the error if the validation is failed
   5. `validateCookies` - object(optional): the usage is as same as validateHeader
   6. `removeQueryString` - boolean(optional): remove the url query string it's true

for example, in `config.rules`

```js
{
  method: 'get',
  url: `${BASE_PATH}/resource`,
  callBack: (req, res, next) => {
    req.url = req.url.replace(`${BASE_PATH}/resource`, `${BASE_PATH}/static/assets`)
    next()
  }
}
```

is equal to

```js
app.get(`${BASE_PATH}/resource`, (req, res) => {
  (req, res, next) => {
    req.url = req.url.replace(`${BASE_PATH}/resource`, `${BASE_PATH}/static/assets`)
    next()
  }
})
```

## Available script

### `yarn start` 
to start the express server

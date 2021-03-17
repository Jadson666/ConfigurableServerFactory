const ConfigurableServerFactory = require('./ConfigurableServerFactory')
const express = require('express')
const config = require('./config')
const app = express()
const port = 3000

app.use(ConfigurableServerFactory(config))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
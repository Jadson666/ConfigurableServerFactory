const express = require('express')
const config = require('./config')
const ConfigurableServerFactory = require('./src/module/ConfigurableServerFactory')
const app = express()
const port = 3000

app.use(ConfigurableServerFactory(config))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
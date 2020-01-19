const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const { initialize } = require('./app/config/db.initialize.js')

const app = express()
app.use(bodyParser.json())

// cors
const inPublic = true
const whitelist = ['https://mygarden-front.herokuapp.com/', 'http://localhost:4200']
const corsOptions = {
  origin(origin, callback) {
    if (inPublic || whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// global.appRoot
global.appRoot = path.resolve(__dirname)

// dotenv
require('dotenv').config({ path: (process.env.NODE_ENV === 'production') ? '.env.production' : '.env.local' })

// router
require('./app/router/router.js')(app)

// db.config
const db = require('./app/config/db.config.js')

// sync db
const syncForse = true
db.sequelize.sync({ force: syncForse }).then(() => {
  // eslint-disable-next-line no-console
  console.log(`Drop and Resync with { force: ${syncForse} }`)
  // db.initialize
  initialize(syncForse, db)
})

// create server
const server = app.listen(process.env.PORT, () => {
  const host = server.address().address
  const { port } = server.address()
  // eslint-disable-next-line no-console
  console.log('App listening at http://%s:%s', host, port)
})

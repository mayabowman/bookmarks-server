require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const winston = require('winston')
const validateBearerToken = require('./validate-bearer-token')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks/bookmarks-router')

const app = express()

const morganOption = (NODE_ENV === 'production' 
  ? 'tiny'
  : 'common')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(validateBearerToken)
app.use(bookmarksRouter)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

module.exports = app

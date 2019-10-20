require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const winston = require('winston')
const uuid = require('uuid/v4')

const app = express()

const morganOption = (NODE_ENV === 'production' 
  ? 'tiny'
  : 'common')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
})

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`)
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleward
  next()
})

const bookmarks = [{
  id: 1,
  title: 'Title One',
  url: 'URL One',
  description: 'Description One',
  rating: 'Rating One'
}]

const list = [{
  list: 'List of bookmarks'
}]

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/bookmarks', (req, res) => {
  res.json(bookmarks)
})

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params
  const bookmark = bookmarks.find(b => b.id == id)

  // make sure we found a bookmark
  if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`)
    return res.status(404).send('Bookmark Not Found')
  }
  res.json(bookmark)
})

app.post('/bookmarks', (req, res) => {
  const { title, url, description, rating } = req.body

  if (!title) {
    logger.error(`Title is required`)
    return res.status(400).send('Invalid data')
  }

  if (!url) {
    logger.error(`Url is required`)
    return res.status(400).send('Invalid data')
  }

  if (!description) {
    logger.error(`Description is required`)
    return res.status(400).send('Invalid data')
  }

  if (!rating) {
    logger.error(`Rating is required`)
    return res.status(400).send('Invalid data')
  }

  const id = uuid()
  const bookmark = {
    id,
    title,
    url,
    description,
    rating
  }

  list.push(bookmark)

  logger.info(`Bookmark with id ${id} created`)

  res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json({id})
})

app.get('/list', (req, res) => {
  res.json(list)
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app

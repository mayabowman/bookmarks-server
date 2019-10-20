const uuid = require('uuid/v4')
const id = uuid()

const bookmarks = [
  { id,
    title: 'Thinkful',
    url: 'https://www.thinkful.com',
    description: 'Think outside the classroom',
    rating: 5 },
  { id,
    title: 'Google',
    url: 'https://www.google.com',
    description: 'Where we find everything else',
    rating: 4 },
  { id,
    title: 'MDN',
    url: 'https://developer.mozilla.org',
    description: 'The only place to find web documentation',
    rating: 5 }
]

module.exports = { bookmarks }
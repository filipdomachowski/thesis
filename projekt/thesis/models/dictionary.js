const database = require('../db')
const entry = require('./entry')

const dictObj = database.Schema({
    key: String,
    parentKey: {type: String, require: false},
    entries: [entry.schema]
})

module.exports = database.model('Dict', dictObj)
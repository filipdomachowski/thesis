const database = require('../db')

const entryObj = database.Schema({
    _id: false,
    key: String
})

module.exports = database.model('Entry', entryObj)
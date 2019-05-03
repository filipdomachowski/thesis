const database = require('../db')

const entryObj = database.Schema({
    _id: false,
    parentKey: {type: String, required: false},
    key: String,
    description: {type: String, required: false},
    param: {type: String, required: false},
    param2: {type: String, required: false},
})

module.exports = database.model('Entry', entryObj)
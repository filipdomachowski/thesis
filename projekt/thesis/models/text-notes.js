const database = require('../db')

const noteObj = database.Schema({
    header: String,
    text: String,
    headerStyle: {},
    textStyle: {},
    date: {type: Date, default: Date.now}
})

module.exports = database.model('Note', noteObj)
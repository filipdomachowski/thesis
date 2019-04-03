const database = require('../db')

const noteObj = database.Schema({    
    text: String,
    date: {type: Date, default: Date.now}
})

module.exports = database.model('Note', noteObj)
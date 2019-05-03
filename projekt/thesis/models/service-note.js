const database = require('../db')

const serviceNoteObj = database.Schema({    
    text: String,
    additionalField: String,
    date: {type: Date, default: Date.now}
})

module.exports = database.model('ServiceNote', serviceNoteObj)
const database = require('../db')
const entry = require('./entry')

const serviceOrderObj = database.Schema({    
    userId: String,
    title: String,
    vehicleCardId: String,    
    dateFrom: Date,
    dateTo: Date,
    servicesList: [entry.schema],    
})

module.exports = database.model('ServiceOrder', serviceOrderObj)
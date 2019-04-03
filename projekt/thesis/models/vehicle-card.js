const database = require('../db')

const vehicleCardObj = database.Schema({    
    userId: String,
    brand: String,
    model: String,
    body: {type: String, required: false},
    engine: String,  
    horsepower: Number,  
    milage: Number
})

module.exports = database.model('VehicleCard', vehicleCardObj)
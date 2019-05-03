const database = require('../db')
const serviceNote = require('./service-note')

const vehicleCardObj = database.Schema({    
    userId: String,
    brand: String,
    model: String,
    generation: String,
    body: String,
    fuelType: String,
    engine: String,  
    horsepower: String,  
    transmissionType: String,
    milage: Number,
    carLicensePlates: String,
    yearOfProduction: Number,    
    serviceHistory: [serviceNote.schema]
})

module.exports = database.model('VehicleCard', vehicleCardObj)
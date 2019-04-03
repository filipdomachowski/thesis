const database = require('../db')

const userObj = database.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, select: false }
})

module.exports = database.model('User', userObj)
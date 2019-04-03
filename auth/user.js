let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/snikuws', { useNewUrlParser: true }, function(){
    console.log('db.js: connected with mongoDB', )
})

let user = mongoose.Schema({
    username: String,
    password: {type: String, select: false}
})

module.exports = mongoose.model('User', user)
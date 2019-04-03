const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/snikuws', { useNewUrlParser: true }, function(){
    console.log('db.js: connected with mongoDB', )
})

module.exports = mongoose
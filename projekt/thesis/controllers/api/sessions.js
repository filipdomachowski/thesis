const router = require('express').Router();
const User = require ('../../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../../config')
const encryption = require('../../admins-crypto')

router.post('/', (req, res, next) => {    
    User.findOne({username: req.body.username})
    .select('password').select('username').select('isUserAdmin')
    .exec((err, user) => {        
        if(err) { return next(err) }
        if(!user) { return res.sendStatus(401)}   
        bcrypt.compare(req.body.password, user.password, (err, valid) => {            
            if(err) { return next(err) }
            if(!valid) { return res.sendStatus(401) }
            console.log("SESSION USER: ", user)
            if(user.isUserAdmin){
                console.log("session super")                
                encryption.randomKey = encryption.generate()                
                console.log("SESSION KEY: ", encryption.randomKey)
                let jwtAdmin = encryption.encrypt(encryption.randomKey)
                var token = jwt.encode({sec: jwtAdmin, username: user.username}, config.secret)     
            }else{                
                console.log("session reg")
                var token = jwt.encode({username: user.username}, config.secret)                                          
            }
            res.send(token)
        })
    })
});

module.exports = router
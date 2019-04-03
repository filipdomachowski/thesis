let User = require ('./user')
let express = require('express');
let jwt = require('jwt-simple');
let bcrypt = require('bcryptjs')
let _ = require('lodash');
let app = express();

app.use(require('body-parser').json());

let secretKey = 'supersecretkey';

app.get('/user', (req, res) => {
    let token = req.headers['x-auth'];
    let auth = jwt.decode(token, secretKey)
    User.findOne({username: auth.username}, function(err, user){
        res.json(user)
    })    
});

app.post('/user', function(req, res, next){
    let user = new User({username: req.body.username})
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        user.password = hash
        user.save((err, user) =>{
            if(err){
                throw next(err)
            }
            res.status(200).json(user)
        })
    })
})

app.post('/session', (req, res, next) => {    
    User.findOne({username: req.body.username})
    .select('password')
    .exec((err, user) => {        
        if(err) { return next(err) }
        if(!user) { return res.sendStatus(401)}   
        bcrypt.compare(req.body.password, user.password, (err, valid) => {            
            if(err) { return next(err) }
            if(!valid) { return res.sendStatus(401) }
            var token = jwt.encode({username: user.username}, secretKey)
            res.json(token)
        })
    })
});

app.listen(3000);
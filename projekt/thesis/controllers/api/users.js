const router = require('express').Router();
const User = require ('../../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('../../config')


router.get('/all', (req, res, next) => {    
    User.find((err, user) => {        
        if(err) { return next(err) }        
        res.json(user)
    })    
});

router.get('/', (req, res, next) => {
    if(!req.headers['x-auth']){
        return res.sendStatus(401)
    }    
    let auth = jwt.decode(req.headers['x-auth'], config.secret)
    User.findOne({username: auth.username}, function(err, user){        
        if(err) { return next(err) }        
        res.json(user)
    })    
});

router.post('/', function(req, res, next){
    if(req.body.username === 'admin' && (req.body.isUserAdmin !== true)){
        res.status(401).send('Nie mozna utworzyć użytkownika o tej nazwie')        
    }else{
        let user = new User({username: req.body.username})
        if(req.body.isUserAdmin){        
            console.log(req.body)
            user.isUserAdmin = req.body.isUserAdmin        
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            user.password = hash
            user.save((err) =>{
                if (err) {return next(err) }            
                res.sendStatus(201)
            })
        })
    }
})

module.exports = router
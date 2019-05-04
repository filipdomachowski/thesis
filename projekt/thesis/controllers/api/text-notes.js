var Note = require('../../models/text-notes')
var router = require('express').Router() //obiekt router używany jako warstwa pośrednicząca aplikacji
var encryption = require('../../admins-crypto')
const jwt = require('jwt-simple');
var config = require('../../config')

router.get('/', (req, res, next) => {    
    Note.find(function(err, note){
        if(err) {return next(err)}
        res.status(201).json(note)
    })
})

router.post('/', (req, res, next) => {
    let auth = jwt.decode(req.headers['x-auth'], config.secret)        
    if(encryption.randomKey !== null){
        if(encryption.decrypt(auth.sec) === encryption.randomKey){
            console.log('UPRAWNIONY')
            var body = req.body
            var note = new Note({
                header:      body.header,
                text:        body.text,
                date:        body.date,
                headerStyle: body.headerStyle,
                textStyle:   body.textStyle
            })
            note.save((err, note) => {
                if(err) {return next(err)}
                res.status(201).json(note)
            })

        }
    }
})

router.patch('/', (req, res) => {    
    let auth = jwt.decode(req.headers['x-auth'], config.secret)        
    if(encryption.randomKey !== null){
        if(encryption.decrypt(auth.sec) === encryption.randomKey){ 
            console.log('UPRAWNIONY')
            var notePatch = req.body
            Note.findById(notePatch._id, (err, note)=>{
                note.set(notePatch)

                note.save((err, note) => {
                    res.send(note)
                });
            })    

        }
    }
})

router.delete('/:id', function(req, res){   
    let auth = jwt.decode(req.headers['x-auth'], config.secret)        
    if(encryption.randomKey !== null){
        if(encryption.decrypt(auth.sec) === encryption.randomKey){     
            console.log('UPRAWNIONY')
            Note.findByIdAndRemove({_id: req.params.id}).then(function(order){
                res.send(order)
            })    

        }
    }
})

module.exports = router

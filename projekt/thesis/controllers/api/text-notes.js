var Note = require('../../models/text-notes')
var router = require('express').Router() //obiekt router używany jako warstwa pośrednicząca aplikacji

router.get('/', function(req, res, next){    
    Note.find(function(err, note){
        if(err) {return next(err)}
        res.status(201).json(note)
    })
})

router.post('/', function(req, res, next){
    var body = req.body
    var note = new Note({
        text: body.text
    })
    note.save(function (err, note){
        if(err) {return next(err)}
        res.status(201).json(note)
    })
})

module.exports = router

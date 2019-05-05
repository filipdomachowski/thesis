var Dict = require('../../models/dictionary')
var router = require('express').Router() //obiekt router używany jako warstwa pośrednicząca aplikacji


router.get('/', (req, res, next) => {        
    Dict.find((err, dict) => {
        if(err) {return next(err)}
        res.status(200).json(dict)        
    }) 
})

router.get('/:key', (req, res, next) => {        
    Dict.findOne({ key: req.params.key }, (err, dict) => {
        if(err) {return next(err)}
        res.status(200).json(dict)        
    }) 
})

router.get('/:key/:parentKey', (req, res, next) => {
    Dict.find({ key: req.params.key, parentKey: req.params.parentKey }, (err, dict) => {        
        if(err) {return next(err)}
        if(dict.length == 0) {return res.status(204).json(dict)}
        else {return res.status(200).json(dict)}
    })
})

router.post('/', (req, res, next) => {
    var body = req.body
    var dict = new Dict({
        key: body.key,
        parentKey: body.parentKey,
        entries: body.entries 
    })
    dict.save( (err, dict) => {
        if(err) {return next(err)}
        res.status(201).json(dict)
    })
})

router.patch('/', function(req, res){     
    var dictPatch = req.body
    Dict.findById(dictPatch._id, (err, dict)=>{
        dict.set(dictPatch)

        dict.save((err, dict) => {
            res.send(dict)
        });
    })     
})

module.exports = router

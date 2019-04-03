var VehicleCard = require('../../models/vehicle-card')
var router = require('express').Router() //obiekt router używany jako warstwa pośrednicząca aplikacji

router.get('/:id', (req, res, next) =>{    
    if(!req.headers['x-auth']){
        return res.send(401)
    }
    console.log(req.params)
    VehicleCard.find({userId : req.params.id}, (err, card) =>{
        if(err) {return next(err)}
        res.status(201).json(card)
    })
})

// find({ key: req.params.key,

router.post('/', (req, res, next) => {
    if(!req.headers['x-auth']){
        return res.sendStatus(401)
    }  
    var body = req.body;
    var cards = [];
    body.forEach((newCard) =>{        
        var vehicleCard = new VehicleCard({
            userId: newCard.userId,
            brand:  newCard.brand,
            model:  newCard.model,
            body:   newCard.body,
            engine: newCard.engine,
            horsepower: newCard.horsepower,
            milage: newCard.milage,        
        })        
        cards.push(vehicleCard)        
    })
    
    VehicleCard.collection.insertMany(cards, (err, card) => {
        if(err) {return next(err)}
        res.status(201).json(card)
    })

})

module.exports = router




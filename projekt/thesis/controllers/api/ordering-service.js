var Order = require('../../models/service-order')
var router = require('express').Router() //obiekt router używany jako warstwa pośrednicząca aplikacji

router.get('/', function(req, res, next){    
    Order.find(function(err, note){
        if(err) {return next(err)}
        res.status(201).json(note)
    })
})

router.get('/:userId', (req, res, next) => {        
    Order.find({ userId: req.params.key }, (err, dict) => {
        if(err) {return next(err)}
        res.status(200).json(dict)        
    }) 
})

router.post('/', (req, res, next) => {
    if(!req.headers['x-auth']){
        return res.sendStatus(401)
    }  
    
    var body = req.body;
    var orders = [];      

    var order = new Order({
        userId:         body.userId,
        vehicleCardId:  body.vehicleCardId,
        title:          body.title,    
        dateFrom:       body.dateFrom,
        dateTo:         body.dateTo,
        servicesList:   body.servicesList,          
    })        
                  
    order.save(orders, (err, order) => {
        if(err) {return next(err)}
        res.status(201).json(order)
    })

})

router.patch('/', function(req, res){         
    var orderPatch = req.body
    Order.findById(orderPatch._id, (err, order) => {
        order.set(orderPatch)

        order.save((err, order) => {
            res.send(order)
        })
    })    
})

router.delete('/:id', function(req, res){        
    Order.findByIdAndRemove({_id: req.params.id}).then(function(order){
        res.send(order)
    })    
})


module.exports = router

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 7070;

app.use(bodyParser.json())

app.use(require('./auth'))
app.use('/api/sessions',                    require('./controllers/api/sessions'))
app.use('/api/users',                       require('./controllers/api/users'))
app.use('/api/text-notes',                  require('./controllers/api/text-notes'))
app.use('/api/vehicle-card',                require('./controllers/api/vehicle-card'))
app.use('/api/vehicle-card/:id',            require('./controllers/api/vehicle-card'))
app.use('/api/dictionaries',                require('./controllers/api/dictionaries'))
app.use('/api/dictionaries/:key',           require('./controllers/api/dictionaries'))
app.use('/api/dictionaries/:key/:parentKey', require('./controllers/api/dictionaries'))
app.use('/api/service-orders',              require('./controllers/api/ordering-service'))
app.use('/api/service-orders/:id',          require('./controllers/api/ordering-service'))

app.use('/', require('./controllers/static'))

app.listen(port, () => {
    console.log("Server is running on port", port)
})
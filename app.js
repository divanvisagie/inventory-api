const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

const config = require('./src/config/config')

const debug = require('debug')('app')

const {requiresToken} = require('./src/auth/filters')

const log = require('./src/logging/log')


mongoose.connect(config.mongoUrl, { 
    useNewUrlParser: true 
}).catch(e => {
    debug('failed to connect to mongo at', config.mongoUrl)
    log.error('Error while connecting to mongo', e)
})
mongoose.connection.on('error', error => debug(error))
mongoose.Promise = global.Promise

require('./src/auth/auth')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const {addRoutes} = require('./src/endpoints')
addRoutes(app)

app.listen(config.port, () => {
    debug(`Server started on port ${config.port}`)
})
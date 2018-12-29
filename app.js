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

const authentication = require('./src/routes/authentication')
const user = require('./src/routes/user')
const store = require('./src/routes/store')
const item = require('./src/routes/item')

app.use('/api/v1/auth', authentication)
app.use('/api/v1/user', requiresToken , user)
app.use('/api/v1/store', requiresToken, store)
app.use('/api/v1/item', requiresToken, item)

app.listen(config.port, () => {
    debug(`Server started on port ${config.port}`)
})
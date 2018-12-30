const {requiresToken} = require('./auth/filters')

const authentication = require('./routes/authentication')
const user = require('./routes/user')
const store = require('./routes/store')
const item = require('./routes/item')

const addRoutes = (app) => {
    app.use('/api/v1/auth', authentication)
    app.use('/api/v1/user', requiresToken , user)
    app.use('/api/v1/store', requiresToken, store)
    app.use('/api/v1/item', requiresToken, item)
}

module.exports = {
    addRoutes
}


const winston = require('winston')

winston.level = process.env.LOG_LEVEL || 'debug'

const mongoName = process.env.MONGO_NAME || 'localhost'
const mongoPort = process.env.MONGO_PORT || 27017
const mongoDatabaseName = process.env.MONGO_DATABASE_NAME || 'local'

const mongoUrl = `mongodb://${mongoName}:${mongoPort}/${mongoDatabaseName}`

module.exports = {
    port: process.env.PORT || 3000,
    mongoUrl,
    jwtSecret: process.env.JWT_SECRET || 'my-secret'
}
const mongoose = require('mongoose')
const debug = require('debug')('app:user-model')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const log = require('../logging/log')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Hook that encrypts the password before save
UserSchema.pre('save', async function(next) {
    const user = this //not a fan of this, need to find a better way
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
    next()
})

UserSchema.methods.isValidPassword = async function(password) {
    const user = this //ugh, this again

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        log.info(`User attempted login with invalid password`)
    }
    return valid
}

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel


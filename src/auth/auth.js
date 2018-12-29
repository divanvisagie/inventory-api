const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const UserModel = require('../model/user-model')
const config = require('../config/config')

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const debug = require('debug')('app:auth')
const log = require('../logging/log')

passport.use(new JWTStrategy({
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    try {
        debug('user authorized successfully with jwt strategy', token.user._id)
        return done(null, token.user)
    } catch (error) {
        done(error)
    }
}))


//passport middleware for user registration
passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.create({email, password}).catch(e => {
            log.error('Could not create new user', e)
        })
        return done(null, user)
    } catch (e) {
        done(e)
    }
}))

//passport middleware for login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const passwordErrorMessage = 'Username or password incorrect'
    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            debug('Incorrect username')
            return done(null, false, { message: passwordErrorMessage })
        }

        const valid = await user.isValidPassword(password)
        if (!valid) {
            debug('Incorrect password')
            return done(null, false, { message: passwordErrorMessage })
        }
        debug('user logged in successfully with local login strategy')
        return done(null, user, { message: 'Logged in successfully' })
    } catch (e) {
        return done(e)
    }
}))


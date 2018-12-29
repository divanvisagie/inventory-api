const passport = require('passport')

const requiresToken = passport.authenticate('jwt', {session: false})

module.exports = {
    requiresToken
}
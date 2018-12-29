const express = require('express')

const router = express.Router()

router.get('/profile', (req,res) => {
    res.json({
        message: 'Hello from secure route',
        user: req.user
    })
})

module.exports = router
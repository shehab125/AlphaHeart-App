"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/auth:

const auth = require('../controllers/auth')

// URL: /auth

router.post('/login', auth.login)  
router.post('/register', auth.register)    
router.post('/logout', auth.logout) 
router.post('/change-password', auth.changePassword)
router.post('/forgot-password', auth.forgotPassword)
router.post('/reset-password', auth.resetPassword)


/* ------------------------------------------------------- */
module.exports = router
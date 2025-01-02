const express = require('express')
const { register, verifyEmail, forgetPassword, resetPassword, signin, signOut, resentVerification } = require('../Controller/userController')
const { userCheck, validate } = require('../Validation/validation')
const router = express.Router()

router.post('/register',userCheck, validate, register)
router.get('/verifyemail/:token', verifyEmail)
router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token',resetPassword )
router.post('/signin', signin)
router.get('/signout', signOut)
router.post('/resendverification', resentVerification)

module.exports = router
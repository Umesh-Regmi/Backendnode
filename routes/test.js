const express = require('express')
const { testFunction } = require('../Controller/testController')
const router = express.Router()

router.get('/test', testFunction)
module.exports = router
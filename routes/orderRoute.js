const express = require('express')
const { placeOrder } = require('../Controller/orderController')
const router = express.Router()

router.post('/placeorder', placeOrder)

module.exports = router
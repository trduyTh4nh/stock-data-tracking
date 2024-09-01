const express = require('express')
const apiController = require('../controller/api.controller')

const router = express.Router()


router.post('/update-symbol', apiController.updateSymbol)
router.post('/update-interval', apiController.updateInterval)
module.exports = router
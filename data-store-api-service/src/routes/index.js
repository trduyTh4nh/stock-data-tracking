const express = require('express')
const stockController = require('../controller/stock.controller')
const router = express.Router()

router.get('/stock', stockController.getAllStock)
router.get('/stockv2', stockController.getAllStockV2)
module.exports = router
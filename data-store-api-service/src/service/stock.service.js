const stockModel = require('../models/stock.model')

class StockServive {
    static async getAllStock() {
        return await stockModel.find({})
    }
    static async getAllStockV2(symbol, interval) {
        console.log('Received symbol:', symbol);
        console.log('Received interval:', interval);

        return await stockModel.find({
            type: symbol,
            interval: interval
        }).sort({ timestamp: 1 })
    }
}

module.exports = StockServive
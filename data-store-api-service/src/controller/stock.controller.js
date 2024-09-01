const StockServive = require("../service/stock.service")

class StockController {
    getAllStock = async (req, res) => {
        try {
            const stocks = await StockServive.getAllStock()
            res.status(200).json(stocks)
        } catch (error) {
            console.error('Error fetching stocks: ', error)
            res.status(500).json({ message: error })
        }
    }

    getAllStockV2 = async (req, res) => {
        const { symbol, interval } = req.query
        console.log({
            symbol, interval
        })
        try {
            const stocks = await StockServive.getAllStockV2(symbol, interval)
            res.status(200).json(stocks)
        }
        catch (error) {
            console.error('Error fetching stocks: ', error)
            res.status(500).json({ message: error })
        }
    }

    
}

module.exports = new StockController()
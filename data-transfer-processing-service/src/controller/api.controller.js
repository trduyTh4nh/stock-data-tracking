const { setNameSymbol, getNameSymbol,
    connectToWebSocket,
    setIntervalFunc,
    getInterval } = require("../connect");
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch')
class ApiController {
    updateSymbol = async (req, res) => {
        try {
            var { newSymbol } = req.body;

            if (newSymbol) {
                setNameSymbol(newSymbol)

                localStorage.setItem('symbol', newSymbol)
                // connectToWebSocket()
                res.send(`WebSocket updated to ${getNameSymbol()}`);
            } else {
                res.status(400).send('Symbol is required');
            }
        } catch (error) {
            console.error(error)
        }
    }

    updateInterval = async (req, res) => {
        try {
            var { newInterval } = req.body;

            if (newInterval) {
                setIntervalFunc(newInterval)
                localStorage.setItem('interval', newInterval)
                // connectToWebSocket()
                res.send(`WebSocket updated to ${getInterval()}`);
            } else {
                res.status(400).send('Symbol is required');
            }
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = new ApiController()
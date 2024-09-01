const WebSocket = require('ws');
const ccxt = require('ccxt');
const moment = require('moment');
const kafka = require('kafka-node');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
// init binance
const binance = new ccxt.binance({
    apiKey: process.env.APIKEY,
    secret: process.env.SECRETKEY,
    enableRateLimit: true,
    options: {
        adjustForTimeDifference: true,
    },
});

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
const producer = new kafka.Producer(client)



binance.setSandboxMode(true);
// ethusdt
// btcusdt
let nameSymbol = localStorage.getItem('symbol');
let interval = localStorage.getItem('interval'); // '1m', '15m', '4h', '1d'

function getNameSymbol() {
    return nameSymbol;
}

function setNameSymbol(newSymbol) {
    nameSymbol = newSymbol.toLowerCase();
}

function getInterval() {
    return interval
}

function setIntervalFunc(newInterval) {
    interval = newInterval.toLowerCase()
}
let lastSentTime = null;
let ws = null;

async function connectToWebSocket() {

    if (ws) {
        ws.close();
        console.log('Closed previous WebSocket connection.');
    }
    ws = new WebSocket(`wss://stream.binance.com:9443/ws/${nameSymbol}@kline_${interval}`);

    ws.on('open', () => {
        console.log('Connected to Binance WebSocket');
    });

    ws.on('message', (data) => {
        const jsonData = JSON.parse(data);
        const kline = jsonData.k;

        const bPrices = {
            type: nameSymbol,
            timestamp: moment(kline.t).format('YYYY-MM-DD HH:mm:ss'),
            open: kline.o,
            high: kline.h,
            low: kline.l,
            close: kline.c,
            volume: kline.v,
            interval: interval
        };

    
        let intervalTime;
        switch (interval) {
            case '15m':
                intervalTime = 15 * 60 * 1000;
                break;
            case '1h':
                intervalTime = 60 * 60 * 1000;
                break;
            case '1d':
                intervalTime = 24 * 60 * 60 * 1000;
                break;
            default:
                intervalTime = 60 * 1000;
                break;
        }

        if (interval !== '1m') {
            if (!lastSentTime || moment().diff(lastSentTime, 'milliseconds') >= intervalTime) {
                sendToKafka(bPrices);
                lastSentTime = moment();
            }
        } else {
            sendToKafka(bPrices);
        }
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        ws = null; 
    });
}

producer.removeAllListeners('error');
producer.on('error', (err) => {
    console.error('Producer encountered an error:', err);
});

function sendToKafka(bPrices) {
    // remove các listener error trước khi send nếu để nhiều quá có thể dẫn đến memory leak 
    // dẫn đến việc kafka gửi 1 lần rất nhiều 
   

    producer.send([{
        topic: 'stock-topic',
        messages: JSON.stringify(bPrices)
    }], (err, data) => {
        if (err) {
            console.error('Failed to send Stock:', err);
        } else {
            console.log('Stock sent:', data);
        }
    });
    console.log('Data sent to Kafka:', bPrices);
}



// async function connectToWebSocket() {

//     const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${nameSymbol}@kline_${interval}`);
//     ws.on('open', () => {
//         console.log('Connected to Binance WebSocket');
//     });

//     ws.on('message', (data) => {
//         const jsonData = JSON.parse(data);
//         const kline = jsonData.k;

//         const bPrices = {
//             type: nameSymbol,
//             timestamp: moment(kline.t).format('YYYY-MM-DD HH:mm:ss'),
//             open: kline.o,
//             high: kline.h,
//             low: kline.l,
//             close: kline.c,
//             volume: kline.v,
//             interval: interval
//         };


//         producer.send([{
//             topic: 'stock-topic',
//             messages: JSON.stringify(bPrices)
//         }], (err, data) => {
//             if (err) {
//                 console.error('Failed to send Stock: ', err);
//             } else {
//                 console.log('Stock sent: ', data);
//             }
//         });

//         producer.on('error', (err) => {
//             console.error('Producer encountered an error:', err)
//         })

//         console.log(bPrices);
//     });

//     ws.on('error', (err) => {
//         console.error('WebSocket error:', err);
//     });

//     ws.on('close', () => {
//         console.log('WebSocket connection closed');
//     });


// }

module.exports = {
    connectToWebSocket,
    getNameSymbol,
    setNameSymbol,
    getInterval,
    setIntervalFunc
};
















// const WebSocket = require('ws');
// const ccxt = require('ccxt');
// const moment = require('moment');
// const express = require('express');
// const kafka = require('kafka-node');
// var LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./scratch');

// // init binance
// const binance = new ccxt.binance({
//     apiKey: process.env.APIKEY,
//     secret: process.env.SECRETKEY,
//     enableRateLimit: true,
//     options: {
//         adjustForTimeDifference: true,
//     },
// });

// const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
// const producer = new kafka.Producer(client)

// binance.setSandboxMode(true);

// let nameSymbol = localStorage.getItem('symbol');
// let interval = localStorage.getItem('interval'); // '1m', '15m', '4h', '1d'

// function getNameSymbol() {
//     return nameSymbol;
// }

// function setNameSymbol(newSymbol) {
//     nameSymbol = newSymbol.toLowerCase();
// }

// function getInterval() {
//     return interval
// }

// function setIntervalFunc(newInterval) {
//     interval = newInterval.toLowerCase()
// }


// // HƠI TỤC VỀ PHẦN THUẬT TOÁN XEM LẠI GẦN ĐÚNG R HAY SAO Á

// fetchOHLCV KHông biết là cái hàm này nó có hoạt động giống những gì t nghĩ không
// nó sẽ từ since tới limit
// since t cho undefined
// limit t cho 1 lầ t giấy 1 giá gần nhất trong khoảng thời gian interval như vậy ổn không
// ví dụ 1m thì interval t fetch về là 1 giây là 1 giây t lấy giá nó về xong t đây

// async function fetchOHLCVData(symbol, timeframe) {
//     try {
//         const ohlcv = await binance.fetchOHLCV(symbol, timeframe, undefined, 1);

//         ohlcv.forEach(candle => {
//             const bPrices = {
//                 type: symbol,
//                 timestamp: moment(candle[0]).format('YYYY-MM-DD HH:mm:ss'),
//                 open: candle[1],
//                 high: candle[2],
//                 low: candle[3],
//                 close: candle[4],
//                 volume: candle[5],
//                 interval: timeframe
//             };

//             producer.send([{
//                 topic: 'stock-topic',
//                 messages: JSON.stringify(bPrices)
//             }], (err, data) => {
//                 if (err) {
//                     console.error('Failed to send Stock: ', err);
//                 } else {
//                     console.log('Stock sent: ', data);
//                 }
//             });

//             console.log(bPrices);
//         });
//     } catch (err) {
//         console.error('Error fetching OHLCV data:', err);
//     }
// }

// async function connectToWebSocket() {
//     try {
//         console.log('Fetching OHLCV data...');

//         // Lặp lại việc fetch dữ liệu sau mỗi 1 phút
//         setInterval(async () => {
//             await fetchOHLCVData(nameSymbol, interval);
//         }, 1000); // 60,000 ms = 1 phút
//     } catch (err) {
//         console.error('Error in connectToWebSocket:', err);
//     }
// }

// module.exports = {
//     connectToWebSocket,
//     getNameSymbol,
//     setNameSymbol,
//     getInterval,
//     setIntervalFunc
// };

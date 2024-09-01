const kafka = require('kafka-node');
const http = require('http');
const app = require('../index');
const Stock = require('./models/stock.model');

const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'stock-topic' }], {
    autoCommit: true,
    fromOffset: 'latest'
});

io.on('connection', (socket) => {
    console.log('A user connected with socket id:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected with socket id:', socket.id);
    });
});

consumer.on('message', async (message) => {
    try {
        const stockData = JSON.parse(message.value);
        console.log(stockData);
        await Stock.create(stockData)
        io.emit('dataUpdate', { type: 'UPDATE_AVAILABLE' });
    } catch (err) {
        console.error('Error processing message:', err);
    }
});

module.exports = server;

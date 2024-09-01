const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan')
const { Server } = require('socket.io');
const kafka = require('kafka-node');
const http = require('http');
const Stock = require('./src/models/stock.model')

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: '*' })); 
app.use(morgan("dev"))
dotenv.config();

// init mongodb
require('./src/init.mongodb');

// init router

// config kafka - websocket
// require('./src/configKafkaSocket');


const router = require('./src/routes/index');
app.use('/', router);



// Tạo HTTP server từ ứng dụng Express
const server = http.createServer(app);

// Khởi tạo Socket.IO với server này
const io = new Server(server);

// Kafka Consumer
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'stock-topic' }], {
    autoCommit: true,
    fromOffset: 'latest'
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Connected stocket id:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected with socket id:', socket.id);
    });
});

consumer.on('message', async (message) => {
    try {
        const stockData = JSON.parse(message.value);
        console.log(stockData);
        await Stock.create(stockData);
        io.emit('dataUpdate', { type: 'UPDATE_AVAILABLE' });
    } catch (err) {
        console.error('Error processing message:', err);
    }
});

server.listen(7000, () => {
    console.log('Data store service running on port 7000');
});

module.exports = app;

const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToWebSocket } = require('./src/connect');

const app = express()
app.use(bodyParser.json());
app.use(express.json())
app.use(cors({ origin: '*' })); 
dotenv.config()

// init kafka

// init route 
const router = require('./src/routers/index')
app.use('/', router)

app.listen(5000, () => {
    console.log('Stock data processing service running on port 5000')
    connectToWebSocket();

})

module.exports = app
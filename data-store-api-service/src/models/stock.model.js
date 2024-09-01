const { default: mongoose } = require("mongoose");
const stockSchema = new mongoose.Schema({
    close: Number,
    timestamp: String,
    high: Number,
    low: Number,
    open: Number,
    interval: String,
    volume: Number,
    type: String
}, {
    timestamps: true
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock
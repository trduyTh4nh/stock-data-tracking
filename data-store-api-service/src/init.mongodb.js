const mongoose = require("mongoose")
const dotenv = require('dotenv')
dotenv.config()

class Database {
    constructor() {
        this.connect()
    }

    connect(type = "mongodb") {
        mongoose.connect(process.env.MONGO_URL)
            .then(() => {
                console.log('Connected to MongoDB')
            })
            .catch((err) => {
                console.error('Failed to connect to MongoDB:', err)
            });
    }

    static getInsance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }


}

const instanceMongoDB = Database.getInsance()

module.exports = instanceMongoDB
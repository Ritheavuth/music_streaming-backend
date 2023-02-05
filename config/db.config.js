require('dotenv').config('../')
const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

mongoose.set('strictQuery', true);

module.exports = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Database Connection Successful")
    } catch(error) {
        console.log(error)
    }
}
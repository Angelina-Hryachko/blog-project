const mongoose = require('mongoose')
const { MONGODB_URI, JWT_SECRET } = require('../const/const.js')

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(MONGODB_URI)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (e) {
        console.log(e)
    }
}

module.exports = connectDB
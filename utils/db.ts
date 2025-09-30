import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL ?? '', {
            dbName: process.env.MONGODB_DB,
        })
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error?.message || '')
    }
}

export default connectDB

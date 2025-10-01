import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const { MONGODB_URL, MONGODB_DB } = process.env
        if (!MONGODB_URL) {
            throw new Error('MONGODB_URL is not set')
        }
        if (!MONGODB_DB) {
            throw new Error('MONGODB_DB is not set')
        }

        await mongoose.connect(MONGODB_URL, {
            dbName: MONGODB_DB,
        })
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error?.message || '')
        throw error
    }
}

export default connectDB

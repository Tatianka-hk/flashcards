import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | null
}

globalThis._mongooseConn = globalThis._mongooseConn || null
globalThis._mongoosePromise = globalThis._mongoosePromise || null

export default async function connectDB() {
  const { MONGODB_URL, MONGODB_DB } = process.env

  if (!MONGODB_URL) throw new Error('MONGODB_URL is not set')
  if (!MONGODB_DB) throw new Error('MONGODB_DB is not set')

  if (globalThis._mongooseConn && mongoose.connection.readyState === 1) {
    return globalThis._mongooseConn
  }

  if (!globalThis._mongoosePromise) {
    globalThis._mongoosePromise = mongoose.connect(MONGODB_URL, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 5000,
    })
  }

  globalThis._mongooseConn = await globalThis._mongoosePromise
  return globalThis._mongooseConn
}

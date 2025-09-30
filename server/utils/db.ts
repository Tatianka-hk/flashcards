import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let _db: Db | null = null

export async function getDB(): Promise<Db> {
    if (_db) return _db

    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not set')

    client = new MongoClient(uri)
    await client.connect()

    const dbName = process.env.MONGODB_DB
    _db = client.db(dbName)

    return _db
}

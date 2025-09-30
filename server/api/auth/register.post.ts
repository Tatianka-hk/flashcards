import { User } from '~/server/models/User'
import connectDB from '~/utils/db'
import { hashPassword } from './utils'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        email: string
        password: string
    }>(event)

    if (!body.email || !body.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing email or password',
        })
    }

    const hashedPassword = hashPassword(body.password)

    await connectDB()

    const existing = await User.findOne({ email: body.email })
    if (existing) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User already exists',
        })
    }

    await User.insertOne({
        email: body.email,
        password: hashedPassword,
        createdAt: new Date(),
    })

    return { success: true, message: 'User registered' }
})

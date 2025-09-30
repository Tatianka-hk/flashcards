import { User } from '~/server/models/User'
import connectDB from '~/utils/db'
import { hashPassword, limitLoginAttempts } from './utils'
import { signJwt, setSessionCookie } from '../../utils/jwt'

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

    const { visited } = limitLoginAttempts(event)

    if (visited >= 10) {
        throw createError({
            statusCode: 429,
            statusMessage: 'Too many login attempts. Try again later.',
        })
    }

    const hashedPassword = hashPassword(body.password)

    await connectDB()

    const existing = await User.findOne({
        email: body.email,
        password: hashedPassword,
    })
    if (existing) {
        const token = signJwt({ uid: String(existing._id) })
        setSessionCookie(event, token)
        return { success: true, message: 'User is authorized ' }
    } else {
        throw createError({
            statusCode: 404,
            statusMessage: 'Invalid data',
        })
    }
})

import { User } from '~/server/models/User'
import connectDB from './../../utils/db'
import { hashPassword, limitLoginAttempts } from './utils'
import { signJwt, setSessionCookie } from './../../utils/jwt'
import { trackUserEvent } from '~/server/services/analyticsService'
import { EVENTS, LOGIN_ERRORS, UserStatusEnum } from '~/static'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        email: string
        password: string
    }>(event)

    const email = body.email.trim().toLowerCase()
    const password = body.password.trim()

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing email or password',
        })
    }

    const { visited } = limitLoginAttempts(event)

    if (visited >= 30) {
        throw createError({
            statusCode: 429,
            statusMessage: LOGIN_ERRORS.TOO_MANY_REQUESTS,
        })
    }

    const hashedPassword = hashPassword(password)

    await connectDB()

    const existing = await User.findOne({
        email,
    })
    if (!existing) {
        throw createError({
            statusCode: 401,
            statusMessage: LOGIN_ERRORS.INCORRECT_CREDERNTIALS,
        })
    }
    if (existing.emailStatus === UserStatusEnum.PENDING) {
        setResponseStatus(event, 401, LOGIN_ERRORS.EMAIL_NOT_VERIFIED)

        return {
            success: false,
            message: LOGIN_ERRORS.EMAIL_NOT_VERIFIED,
        }
    }
    if (existing && existing.password === hashedPassword) {
        const token = signJwt({ uid: String(existing._id) })
        setSessionCookie(event, token)

        await trackUserEvent({
            userId: existing._id.toString(),
            email,
            type: EVENTS.LOGIN,
        })
        return { success: true, message: 'User is authorized' }
    } else {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid data',
        })
    }
})

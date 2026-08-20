import { User } from '~/server/models/User'
import { EVENTS, UserStatusEnum } from '~/static'

import connectDB from './../../utils/db'
import { hashPassword } from './utils'
import { trackUserEvent } from '~/server/services/analyticsService'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        email: string
        password: string
        locale: string
    }>(event)
    const email = body.email.trim().toLowerCase()
    const password = body.password.trim()
    const locale = body.locale

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing email or password',
        })
    }

    const hashedPassword = hashPassword(password)

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
        throw createError({
            statusCode: 409,
            statusMessage: 'User already exists',
        })
    }

    const user = await User.insertOne({
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
        emailStatus: UserStatusEnum.PENDING,
    })
    await verifyEmail(user._id, email, locale, event)
    await trackUserEvent({
        userId: user._id.toString(),
        email,
        type: EVENTS.REGISTER,
    })

    return { success: true, message: 'User registered' }
})

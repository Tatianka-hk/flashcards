import connectDB from '../../../utils/db'
import { Card } from '~/server/models/Card'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        cardIds: string[]
    }>(event)
    const cardIds = body.cardIds

    if (!cardIds) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing card IDs',
        })
    }

    const userId = (event.context as any).userId
    if (!userId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    try {
        await connectDB()
        const result = await Card.deleteMany({ _id: { $in: cardIds } })
        if (result.deletedCount === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Cards not found',
            })
        }

        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

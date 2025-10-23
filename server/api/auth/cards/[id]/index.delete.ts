import connectDB from '../../../../utils/db'
import { Card } from '~/server/models/Card'

export default defineEventHandler(async (event) => {
    const cardId: string | undefined = getRouterParam(event, 'id')
    if (!cardId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing card ID',
        })
    }

    const userId = (event.context as any).userId
    if (!userId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    try {
        await connectDB()
        const result = await Card.deleteOne({ _id: cardId })
        if (result.deletedCount === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Card not found',
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

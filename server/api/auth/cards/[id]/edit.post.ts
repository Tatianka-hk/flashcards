import connectDB from '../../../../utils/db'
import { Card } from '~/server/models/Card'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        front: string
        back: string
    }>(event)

    const cardId: string | undefined = getRouterParam(event, 'id')
    if (!cardId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing Card ID',
        })
    }

    if (!body.front || !body.back) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing data in payload',
        })
    }

    const userId = (event.context as any).userId
    if (!userId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    try {
        await connectDB()
        const card = await Card.findOneAndUpdate(
            { _id: cardId },
            { $set: { front: body.front, back: body.back } }
        )
        if (!card) {
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

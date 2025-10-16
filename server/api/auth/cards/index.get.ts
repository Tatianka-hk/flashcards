import connectDB from '../../../utils/db'
import { Card } from '~/server/models/Card'

export default defineEventHandler(async (event) => {
    const { folderId = null } = getQuery(event) as {
        folderId?: string | null
    }
    try {
        await connectDB()
        const userId = event.context.userId
        if (!userId) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }
        const cards = await Card.find({
            folderId: folderId,
        })
        return { success: true, cards }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

import { ICard, IDbCard } from '~/types'
import connectDB from '../../../utils/db'
import { Card } from '~/server/models/Card'
// треба подумати чи щоб при створенні карток на сторінці мають бути картки що вже є чи немає
export default defineEventHandler(async (event) => {
    const body = await readBody<{
        folderId: string
        cards?: ICard[]
    }>(event)

    if (!body.cards) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing cards',
        })
    }

    if (!body.folderId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing folder ID',
        })
    }

    try {
        await connectDB()

        const cards: IDbCard[] = body.cards.map((card) => {
            return {
                front: card.front,
                back: card.back,
                folderId: body.folderId,
                createdAt: new Date(),
            }
        })
        await Card.insertMany(cards)
        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

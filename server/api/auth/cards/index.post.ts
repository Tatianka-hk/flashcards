import { ICard, IDbCard } from '~/types'
import connectDB from '../../../utils/db'
import { Card } from '~/server/models/Card'

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
        const userId = event.context.userId
        const cardsExist: IDbCard[] = await Card.find({
            folderId: body.folderId,
        })
        //card to delete if card is in db but not in body
        const cardsToDelete: IDbCard[] = cardsExist.filter(
            (card) => !body.cards?.find((c) => c._id === card._id)
        )
        console.log('toDelete: ', cardsToDelete)
        if (cardsToDelete.length > 0) {
            await Card.deleteMany({
                _id: { $in: cardsToDelete.map((card) => card._id) },
            })
        }
        //cards to update
        const cardsToUpdate: IDbCard[] = cardsExist.filter((card) =>
            body.cards?.find((c) => c._id === card._id)
        )
        console.log('toUpdate: ', cardsToUpdate)
        if (cardsToUpdate.length > 0) {
            await Card.updateMany(
                { _id: { $in: cardsToUpdate.map((card) => card._id) } },
                {
                    $set: {
                        front: cardsToUpdate.map((card) => card.front),
                        back: cardsToUpdate.map((card) => card.back),
                    },
                }
            )
        }

        const cardToAdd: IDbCard[] = body.cards?.filter(
            (card) => !cardsExist.find((c) => c._id === card._id)
        )
        if (cardToAdd.length > 0) {
            await Card.insertMany(
                cardToAdd.map((card) => ({
                    front: card.front,
                    back: card.back,
                    folderId: body.folderId,
                    createdAt: new Date(),
                }))
            )
            cardToAdd.forEach(async (card) => {
                await Card.create({
                    front: card.front,
                    back: card.back,
                    folderId: body.folderId,
                    createdAt: new Date(),
                })
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

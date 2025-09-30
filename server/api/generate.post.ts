import { getFlashCardsFromDocument } from '../utils/flashcards'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{ text?: string }>(event)

        if (!body?.text || typeof body.text !== 'string') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid input',
            })
        }

        const flashcards = await getFlashCardsFromDocument(body.text)
        return { flashcards }
    } catch (err: any) {
        if (err?.statusCode) throw err
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

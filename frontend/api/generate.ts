import { VercelRequest, VercelResponse } from '@vercel/node'
import { getFlashCardsFromDocument } from './utils'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const { text } = req.body

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Invalid input' })
        }

        const flashcards = await getFlashCardsFromDocument(text)

        res.status(200).json({ flashcards })
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) })
    }
}

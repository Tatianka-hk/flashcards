import express from 'express'
import cors from 'cors'
import { getFlashCardsFromDocument } from './utils'

const app = express()
const PORT = 3001
console.log(process.env.FRONTEND_URL)
// app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())
app.use(cors())

app.post('/flashcards', async (req, res) => {
  try {
    const { text } = req.body

    if (!text || typeof text !== 'string') {
      return res.status(400).send('Bad Request: missing text')
    }

    const result = await getFlashCardsFromDocument(text)

    res.status(200).json({ flashcards: result })
  } catch (err: any) {
    res.status(500).send(`Server Error: ${err.message}`)
  }
})

app.use((req, res) => {
  res.status(404).send('Not Found')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})

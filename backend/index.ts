import http, { IncomingMessage, ServerResponse } from 'http'
import { getFlashCardsFromDocument } from './utils'
async function handleFlashcards(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method Not Allowed')
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', async () => {
    try {
      const parsed = JSON.parse(body)
      const text = parsed.text

      if (!text || typeof text !== 'string') {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Bad Request: missing text')
        return
      }

      const result = await getFlashCardsFromDocument(text)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ flashcards: result }))
    } catch (err: any) {
      console.error('❌ Помилка парсингу або AI:', err.message)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end(`Server Error: ${err.message}`)
    }
  })
}

const server = http.createServer((req, res) => {
  if (req.url === '/flashcards') {
    handleFlashcards(req, res)
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})

server.listen(3001, () => {
  console.log('Server running at http://localhost:3001/')
})

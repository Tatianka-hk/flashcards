import { ICard } from '~/types'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

if (!TOGETHER_API_KEY) {
    throw new Error('TOGETHER_API_KEY is not set')
}

export async function getFlashCardsFromDocument(text: string) {
    const prompt = `You must create flashcards from the provided text.

STRICT OUTPUT RULES:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT use bullet points.
- Do NOT write explanations.
- Do NOT wrap JSON in \`\`\`.
- The response must start with { and end with }.
- Use exactly this structure:

{
  "flashcards": [
    {
      "front": "short question",
      "back": "short answer"
    }
  ]
}

Rules for flashcards:
- Create between 5 and 15 flashcards.
- front must be a question.
- back must be a short answer.
- Do not include email, phone number, Telegram, LinkedIn, or private contact data.
- Use the same language as the input text if possible.

TEXT:
    ${text}
    Флешкартки:`
    const togetherRes = await fetch(
        'https://api.together.xyz/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOGETHER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'Qwen/Qwen3.5-9B',
                messages: [
                    { role: 'system', content: 'Ти генератор флешкарток' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0,
                reasoning: { enabled: false },
                response_format: {
                    type: 'json_schema',
                    json_schema: {
                        name: 'flashcards_response',
                        schema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                flashcards: {
                                    type: 'array',
                                    maxItems: 10,
                                    items: {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                            front: {
                                                type: 'string',
                                            },
                                            back: {
                                                type: 'string',
                                            },
                                        },
                                        required: ['front', 'back'],
                                    },
                                },
                            },
                            required: ['flashcards'],
                        },
                    },
                },
            }),
        }
    )
    const json = await togetherRes.json()
    if (!togetherRes.ok) {
        console.error('Together API error:', json)

        throw new Error(
            json?.error?.message || `Together API error: ${togetherRes.status}`
        )
    }
    console.log(json?.choices?.[0]?.message)

    const content = json?.choices?.[0]?.message?.content

    if (!content) {
        console.error('Unexpected Together response:', json)

        throw new Error('Together API did not return message content')
    }

    return parseResult(content)
}
function parseResult(content: string): ICard[] {
    const cleaned = content
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .replace(/`json/gi, '')
        .replace(/`/g, '')
        .trim()

    try {
        const parsed = JSON.parse(cleaned)

        const flashcards = Array.isArray(parsed) ? parsed : parsed?.flashcards

        if (!Array.isArray(flashcards)) {
            throw new Error('AI response does not contain flashcards array')
        }

        return normalizeFlashcards(flashcards)
    } catch (jsonError) {
        console.warn('JSON.parse failed, trying fallback parser...')
    }

    const fallbackCards = parseBrokenJsonFlashcards(cleaned)

    if (fallbackCards.length > 0) {
        return fallbackCards
    }

    console.error('Failed to parse AI response:')
    console.error(content)

    throw new Error('Failed to parse flashcards response')
}

function normalizeFlashcards(items: any[]): ICard[] {
    return items
        .map((item) => ({
            front: String(item?.front || '').trim(),
            back: String(item?.back || '').trim(),
        }))
        .filter((item: ICard) => item.front && item.back)
}

function parseBrokenJsonFlashcards(content: string): ICard[] {
    const cards: ICard[] = []

    const pairRegex =
        /"front"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"back"\s*:\s*"((?:\\.|[^"\\])*)"/g

    let match: RegExpExecArray | null

    while ((match = pairRegex.exec(content)) !== null) {
        cards.push({
            front: decodeJsonString(match[1]).trim(),
            back: decodeJsonString(match[2]).trim(),
        })
    }

    return cards.filter((card) => card.front && card.back)
}

function decodeJsonString(value: string): string {
    try {
        return JSON.parse(`"${value}"`)
    } catch {
        return value
    }
}

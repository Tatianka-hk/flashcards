import { ICard } from '~/types'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

if (!TOGETHER_API_KEY) {
    throw new Error('TOGETHER_API_KEY is not set')
}

export async function getFlashCardsFromDocument(text: string) {
    const prompt = `Прочитай текст і створи флешкартки у форматі:
    front: запитання
    back: відповідь

    Текст:
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
                temperature: 0.7,
                reasoning: { enabled: false },
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
    try {
        const cleaned = content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .replace(/`json/g, '')
            .replace(/`/g, '')
            .trim()

        const start = cleaned.indexOf('[')
        const end = cleaned.lastIndexOf(']')

        if (start === -1 || end === -1) {
            throw new Error('No JSON array found in AI response')
        }

        const jsonString = cleaned.slice(start, end + 1)

        const parsed = JSON.parse(jsonString)

        if (!Array.isArray(parsed)) {
            throw new Error('AI response is not an array')
        }

        return parsed
            .map((item: any) => ({
                front: String(item.front || '').trim(),
                back: String(item.back || '').trim(),
            }))
            .filter((item: ICard) => item.front && item.back)
    } catch (err) {
        console.error('Failed to parse AI response:')
        console.error(content)

        throw new Error('Failed to parse flashcards response')
    }
}

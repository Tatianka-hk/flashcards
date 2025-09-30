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
                model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
                messages: [
                    { role: 'system', content: 'Ти генератор флешкарток' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        }
    )
    const json = await togetherRes.json()
    const content = json.choices[0].message.content
    return parseResult(content)
}

function parseResult(content: string) {
    const blocks = content.split('\n\n').map((b) => b.trim())
    return blocks
        .map((b) => {
            const front = b.match(/front:\s*(.+)/i)?.[1] || ''
            const back = b.match(/back:\s*(.+)/i)?.[1] || ''
            return { front, back }
        })
        .filter((fc) => fc.front && fc.back)
}

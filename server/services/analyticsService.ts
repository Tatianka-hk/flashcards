import { EVENTS } from '~/static/analytic'
import { sendTelegramMessage } from './telegramService'

interface TrackEventOptions {
    userId: string
    email: string
    type: EVENTS
    data?: Record<string, unknown>
}

export async function trackUserEvent({
    userId,
    email,
    type,
    data = {},
}: TrackEventOptions) {
    await sendTelegramMessage(
        formatTelegramMessage({
            userId,
            email,
            type,
            data,
        })
    )
}

function formatTelegramMessage({
    userId,
    email,
    type,
    data,
}: TrackEventOptions) {
    switch (type) {
        case EVENTS.REGISTER:
            return `
🆕 Реєстріція

Користувач: ${userId}
Email: ${email ?? '-'}
`.trim()

        case EVENTS.LOGIN:
            return `
🔐 Вхід в аккаунт

Користувач: ${userId}
Email: ${email ?? '-'}
`.trim()

        case EVENTS.FOLDER_CREATE:
            return `
🔎 Створення нової папки

Користувач: ${userId}
Email: ${email ?? '-'}
Назва папки: ${data?.folderName ?? '-'}
ID папки: ${data?.folderId ?? '-'}
`.trim()
    }
}

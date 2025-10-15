import { ICard, IDbCard } from '~/types'
import { apiRequest } from './api'

const PREFIX = '/auth/cards'

export function saveCards(data: { folderId: string; cards: ICard[] }) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}`,
        data,
    })
}

export function getCards(folderId?: string | null) {
    const url =
        folderId != null && folderId !== ''
            ? `${PREFIX}?${new URLSearchParams({ folderId }).toString()}`
            : `${PREFIX}`
    return apiRequest({
        method: 'GET',
        url,
    })
}

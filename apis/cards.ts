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

export function getCard(
    cardId: string
): Promise<{ success: boolean; card: ICard }> {
    const url = `${PREFIX}/${cardId}`
    return apiRequest({
        method: 'GET',
        url,
    })
}

export function editCard(cardId: string, data: ICard) {
    const url = `${PREFIX}/${cardId}/edit`
    return apiRequest({
        method: 'POST',
        url,
        data,
    })
}

export function deleteCard(cardId: string) {
    const url = `${PREFIX}/${cardId}`
    return apiRequest({
        method: 'DELETE',
        url,
    })
}

export function addCards(data: { folderId: string; cards: ICard[] }) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/add`,
        data,
    })
}

export function deleteManyCards(ids: string[]) {
    return apiRequest({
        method: 'DELETE',
        url: `${PREFIX}/delete_many`,
        data: { cardIds: ids },
    })
}

export function moveCards(data: {
    folderId: string
    cards: ICard[]
    oldFolderId: string
}) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/move`,
        data,
    })
}

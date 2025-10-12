import { apiRequest } from './api'

const PREFIX = '/auth/folders'

export function addFolder(data: { name: string; parentId?: string }) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/add`,
        data,
    })
}

export function getFolders() {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}`,
    })
}

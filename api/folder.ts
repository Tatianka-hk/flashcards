import { apiRequest } from './api'

const PREFIX = '/auth/folders'

export function addFolder(data: { name: string; parentId?: string }) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/add`,
        data,
    })
}

export function getFolders(parentId?: string | null) {
    const url = parentId ? `${PREFIX}?parentId=${parentId}` : `${PREFIX}`
    return apiRequest({
        method: 'GET',
        url: `${url}`,
    })
}

export function editFolder(folderID: string, name: string) {
    return apiRequest({
        method: 'PUT',
        url: `${PREFIX}/${folderID}/edit`,
        data: { name: name },
    })
}

export function deleteFolder(folderID: string) {
    return apiRequest({
        method: 'DELETE',
        url: `${PREFIX}/${folderID}/delete`,
    })
}

import { apiRequest } from './api'

const PREFIX = '/auth/folders'

export function addFolder(data: {
    name: string
    parentId?: string
    lang: string
}) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/add`,
        data,
    })
}

export function getFolders(parentId?: string | null) {
    const url =
        parentId != null && parentId !== ''
            ? `${PREFIX}?${new URLSearchParams({ parentId }).toString()}`
            : `${PREFIX}`
    return apiRequest({
        method: 'GET',
        url,
    })
}

export function editFolder(folderID: string, name: string, lang: string) {
    return apiRequest({
        method: 'PUT',
        url: `${PREFIX}/${encodeURIComponent(folderID)}/edit`,
        data: { name: name, lang: lang },
    })
}

export function deleteFolder(folderID: string) {
    return apiRequest({
        method: 'DELETE',
        url: `${PREFIX}/${encodeURIComponent(folderID)}/delete`,
    })
}

export function getAllCard(folderId: string) {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/${encodeURIComponent(folderId)}/all_cards`,
    })
}

export function getLang(folderId: string) {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/${encodeURIComponent(folderId)}/lang`,
    })
}

export function getParentFolder(folderId: string) {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/${encodeURIComponent(folderId)}/parent`,
    })
}

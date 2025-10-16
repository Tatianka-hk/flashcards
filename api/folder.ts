import { apiRequest } from './api'

const PREFIX = '/auth/folders'

/**
 * Creates a new folder.
 *
 * @param data - Object with properties for the new folder:
 *   - name: The folder's display name.
 *   - parentId: Optional parent folder ID; when provided, the new folder will be created under that parent.
 * @returns The newly created folder resource.
 */
export function addFolder(data: { name: string; parentId?: string }) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/add`,
        data,
    })
}

/**
 * Retrieves folders, optionally filtered by a parent folder.
 *
 * @param parentId - If provided and not an empty string, limits results to folders with this parent ID.
 * @returns The API response containing the requested folders.
 */
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

/**
 * Renames an existing folder.
 *
 * @param folderID - The identifier of the folder to rename
 * @param name - The new name for the folder
 * @returns The API response for the edit operation
 */
export function editFolder(folderID: string, name: string) {
    return apiRequest({
        method: 'PUT',
        url: `${PREFIX}/${encodeURIComponent(folderID)}/edit`,
        data: { name: name },
    })
}

/**
 * Delete a folder by its ID.
 *
 * @param folderID - The ID of the folder to delete
 * @returns The server response for the delete operation
 */
export function deleteFolder(folderID: string) {
    return apiRequest({
        method: 'DELETE',
        url: `${PREFIX}/${encodeURIComponent(folderID)}/delete`,
    })
}
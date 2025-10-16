import { apiRequest } from './api'

const PREFIX = '/auth'

export type AuthUserType = {
    email: string
    password: string
}

export function registerUser(data: AuthUserType) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/register`,
        data,
    })
}

/**
 * Authenticate a user using their email and password.
 *
 * @param data - User credentials containing `email` and `password`
 * @returns The response from the authentication API
 */
export function login(data: AuthUserType) {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/login`,
        data,
    })
}

/**
 * Invalidate the current user's session on the server.
 *
 * @returns The response from the logout API request
 */
export function logout() {
    return apiRequest({
        method: 'POST',
        url: `${PREFIX}/logout`,
    })
}

/**
 * Fetches the authenticated user's email address from the API.
 *
 * @returns The server response containing the authenticated user's email address.
 */
export function getEmail() {
    return apiRequest({
        method: 'GET',
        url: `${PREFIX}/email`,
    })
}
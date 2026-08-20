export const MAX_USES = 3

export const langs = [
    { value: 'en', label: 'English' },
    { value: 'ua', label: 'Українська' },
    { value: 'esp', label: 'Español' },
    { value: 'cat', label: 'Catalan' },
    { value: 'fr', label: 'Francais' },
]

export const langs20 = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文 (Mandarin)' },
    { value: 'ca', label: 'Català' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'pt', label: 'Português' },
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'ur', label: 'اردو' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'sw', label: 'Kiswahili' },
    { value: 'mr', label: 'मराठी' },
    { value: 'te', label: 'తెలుగు' },
    { value: 'tr', label: 'Türkçe' },
    { value: 'ko', label: '한국어' },
    { value: 'it', label: 'Italiano' },
    { value: 'vi', label: 'Tiếng Việt' },
]

export enum UserStatusEnum {
    VERIFIED = 'verified',
    PENDING = 'pending',
}
export const PASSWORD_MIN_LENGTH = 6
export const TOKEN_EXPIRES_MS = 24 * 60 * 60 * 1000
export const STORAGE_KEY = 'app-locale'

export enum EVENTS {
    REGISTER = 'REGISTER',
    LOGIN = 'login',
    FOLDER_CREATE = 'folder_create',
}
export enum TOKEN_TYPE {
    RESET_PASSWORD = 'reset_password',
    EMAIL_VERIFICATION = 'email_verification',
}

export enum LOGIN_ERRORS {
    INCORRECT_CREDERNTIALS = 'Invalid data',
    EMAIL_NOT_VERIFIED = 'email_not_verified',
    TOO_MANY_REQUESTS = 'Too many login attempts. Try again later.',
    TOKEN_EXPIRED = 'token_expired',
    SOMETHING_WENT_WRONG = 'something_went_wrong',
}

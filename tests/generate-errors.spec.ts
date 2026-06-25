import { test, expect } from '@playwright/test'

const locales = [
    {
        code: 'en',
        errors: {
            400: 'Invalid file or input. Please upload a valid PDF.',
            401: 'Authorization error. Please try again later.',
            429: 'Too many requests. Please wait a bit and try again.',
            500: 'Server error. Please try again later.',
        },
    },
    {
        code: 'esp',
        errors: {
            400: 'Archivo o entrada no válidos. Por favor, sube un PDF válido.',
            401: 'Error de autorización. Por favor, inténtalo de nuevo más tarde.',
            429: 'Demasiadas solicitudes. Espera un poco e inténtalo de nuevo.',
            500: 'Error del servidor. Por favor, inténtalo de nuevo más tarde.',
        },
    },
    {
        code: 'ua',
        errors: {
            400: 'Недійсний файл або введені дані. Будь ласка, завантажте валідний PDF.',
            401: 'Помилка авторизації. Будь ласка, спробуйте пізніше.',
            429: 'Забагато запитів. Зачекайте трохи й спробуйте ще раз.',
            500: 'Помилка сервера. Будь ласка, спробуйте пізніше.',
        },
    },
    {
        code: 'ca',
        errors: {
            400: 'Fitxer o entrada no vàlids. Si us plau, puja un PDF vàlid.',
            401: "Error d'autorització. Si us plau, torna-ho a provar més tard.",
            429: 'Massa sol·licituds. Espera una mica i torna-ho a provar.',
            500: 'Error del servidor. Si us plau, torna-ho a provar més tard.',
        },
    },
] as const

const statuses = [400, 401, 429, 500] as const

for (const locale of locales) {
    for (const status of statuses) {
        test(`shows clear error for HTTP ${status} in ${locale.code}`, async ({
            page,
        }) => {
            await page.route('**/api/generate', async (route) => {
                await route.fulfill({
                    status,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        statusCode: status,
                        statusMessage: 'Mocked API error',
                    }),
                })
            })

            await page.addInitScript((localeCode) => {
                localStorage.setItem('app-locale', localeCode)
            }, locale.code)

            await page.goto('/')

            await page.getByTestId('generate-button').click()

            await expect(page.getByTestId('error-message')).toBeVisible()
            await expect(page.getByTestId('error-message')).toContainText(
                locale.errors[status]
            )
        })
    }
}

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generate-errors.spec.ts >> shows clear error for HTTP 429 in en
- Location: tests\generate-errors.spec.ts:46:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('generate-button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]: FLASH CARDS
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: Email
        - textbox "Email" [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e11]: Password
        - textbox "Password" [ref=e12]
    - button "Login" [disabled] [ref=e13]
  - generic:
    - img
  - generic:
    - generic:
      - generic:
        - button "Go to parent" [disabled]
        - button "Open in editor"
        - button "Close"
  - generic [ref=e14]:
    - button "Toggle Nuxt DevTools" [ref=e15] [cursor=pointer]:
      - img [ref=e16]
    - generic "Page load time" [ref=e19]:
      - generic [ref=e20]: "67"
      - generic [ref=e21]: ms
    - button "Toggle Component Inspector" [ref=e23] [cursor=pointer]:
      - img [ref=e24]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const locales = [
  4  |     {
  5  |         code: 'en',
  6  |         errors: {
  7  |             400: 'Invalid file or input. Please upload a valid PDF.',
  8  |             401: 'Authorization error. Please try again later.',
  9  |             429: 'Too many requests. Please wait a bit and try again.',
  10 |             500: 'Server error. Please try again later.',
  11 |         },
  12 |     },
  13 |     {
  14 |         code: 'esp',
  15 |         errors: {
  16 |             400: 'Archivo o entrada no válidos. Por favor, sube un PDF válido.',
  17 |             401: 'Error de autorización. Por favor, inténtalo de nuevo más tarde.',
  18 |             429: 'Demasiadas solicitudes. Espera un poco e inténtalo de nuevo.',
  19 |             500: 'Error del servidor. Por favor, inténtalo de nuevo más tarde.',
  20 |         },
  21 |     },
  22 |     {
  23 |         code: 'ua',
  24 |         errors: {
  25 |             400: 'Недійсний файл або введені дані. Будь ласка, завантажте валідний PDF.',
  26 |             401: 'Помилка авторизації. Будь ласка, спробуйте пізніше.',
  27 |             429: 'Забагато запитів. Зачекайте трохи й спробуйте ще раз.',
  28 |             500: 'Помилка сервера. Будь ласка, спробуйте пізніше.',
  29 |         },
  30 |     },
  31 |     {
  32 |         code: 'ca',
  33 |         errors: {
  34 |             400: 'Fitxer o entrada no vàlids. Si us plau, puja un PDF vàlid.',
  35 |             401: "Error d'autorització. Si us plau, torna-ho a provar més tard.",
  36 |             429: 'Massa sol·licituds. Espera una mica i torna-ho a provar.',
  37 |             500: 'Error del servidor. Si us plau, torna-ho a provar més tard.',
  38 |         },
  39 |     },
  40 | ] as const
  41 | 
  42 | const statuses = [400, 401, 429, 500] as const
  43 | 
  44 | for (const locale of locales) {
  45 |     for (const status of statuses) {
  46 |         test(`shows clear error for HTTP ${status} in ${locale.code}`, async ({
  47 |             page,
  48 |         }) => {
  49 |             await page.route('**/api/generate', async (route) => {
  50 |                 await route.fulfill({
  51 |                     status,
  52 |                     contentType: 'application/json',
  53 |                     body: JSON.stringify({
  54 |                         statusCode: status,
  55 |                         statusMessage: 'Mocked API error',
  56 |                     }),
  57 |                 })
  58 |             })
  59 | 
  60 |             await page.addInitScript((localeCode) => {
  61 |                 localStorage.setItem('app-locale', localeCode)
  62 |             }, locale.code)
  63 | 
  64 |             await page.goto('/')
  65 | 
> 66 |             await page.getByTestId('generate-button').click()
     |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  67 | 
  68 |             await expect(page.getByTestId('error-message')).toBeVisible()
  69 |             await expect(page.getByTestId('error-message')).toContainText(
  70 |                 locale.errors[status]
  71 |             )
  72 |         })
  73 |     }
  74 | }
  75 | 
```
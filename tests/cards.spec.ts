import { expect, test, type Page } from '@playwright/test'

type Card = {
    _id: string
    front: string
    back: string
    folderId: string
}

const folderId = 'folder-1'

async function mockCardApi(page: Page, cards: Card[] = []) {
    await page.addInitScript(() => {
        localStorage.setItem('app-locale', 'en')
    })

    await page.route('**/api/**', async (route) => {
        const request = route.request()
        const url = new URL(request.url())
        const method = request.method()
        const path = url.pathname

        if (path === '/api/me') {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ isAuth: true, userId: 'user-1' }),
            })
            return
        }

        if (path === `/api/auth/folders/${folderId}/lang`) {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ success: true, lang: 'en' }),
            })
            return
        }

        if (path === '/api/auth/folders' && method === 'GET') {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ success: true, folders: [] }),
            })
            return
        }

        if (path === '/api/auth/cards' && method === 'GET') {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ success: true, cards }),
            })
            return
        }

        if (path === '/api/auth/cards/delete_many' && method === 'DELETE') {
            const { cardIds } = JSON.parse(request.postData() ?? '{}')
            cards.splice(
                0,
                cards.length,
                ...cards.filter((card) => !cardIds.includes(card._id))
            )
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            })
            return
        }

        const singleCardMatch = path.match(/^\/api\/auth\/cards\/([^/]+)$/)
        if (singleCardMatch && method === 'GET') {
            const card = cards.find((item) => item._id === singleCardMatch[1])
            await route.fulfill({
                status: card ? 200 : 404,
                contentType: 'application/json',
                body: JSON.stringify({ success: Boolean(card), card }),
            })
            return
        }

        if (singleCardMatch && method === 'DELETE') {
            const cardId = singleCardMatch[1]
            cards.splice(
                0,
                cards.length,
                ...cards.filter((card) => card._id !== cardId)
            )
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            })
            return
        }

        await route.continue()
    })
}

test.describe('cards', () => {
    test('renders cards for the selected folder', async ({ page }) => {
        await mockCardApi(page, [
            {
                _id: 'card-1',
                front: 'Photosynthesis',
                back: 'Plants convert light into energy',
                folderId,
            },
            {
                _id: 'card-2',
                front: 'Mitosis',
                back: 'Cell division',
                folderId,
            },
        ])

        await page.goto(`/folder/${folderId}`)

        await expect(page.getByText('Photosynthesis')).toBeVisible()
        await expect(page.getByText('Mitosis')).toBeVisible()
        await expect(page.getByText('Nothing here yet')).toBeHidden()
    })

    test('shows an empty state when a folder has no cards', async ({ page }) => {
        await mockCardApi(page, [])

        await page.goto(`/folder/${folderId}`)

        await expect(page.getByText('Nothing here yet')).toBeVisible()
    })

    test('selects cards and deletes selected cards in bulk', async ({
        page,
    }) => {
        await mockCardApi(page, [
            {
                _id: 'card-1',
                front: 'Photosynthesis',
                back: 'Plants convert light into energy',
                folderId,
            },
            {
                _id: 'card-2',
                front: 'Mitosis',
                back: 'Cell division',
                folderId,
            },
        ])

        await page.goto(`/folder/${folderId}`)

        await page.locator('input[type="checkbox"]').first().check({
            force: true,
        })

        await expect(page.getByText('Selected:')).toBeVisible()
        await expect(page.locator('.sticky b')).toHaveText('1')

        await page.locator('.sticky svg').last().click()

        await expect(page.getByText('Photosynthesis')).toBeHidden()
        await expect(page.getByText('Mitosis')).toBeVisible()
        await expect(page.getByText('Selected:')).toBeHidden()
    })

    test('deletes a single card from the card menu', async ({ page }) => {
        await mockCardApi(page, [
            {
                _id: 'card-1',
                front: 'Photosynthesis',
                back: 'Plants convert light into energy',
                folderId,
            },
        ])

        await page.goto(`/folder/${folderId}`)

        await page.locator('button[aria-haspopup="menu"]').first().click()
        await page.getByRole('menuitem', { name: 'Delete' }).click()

        await expect(page.getByText('Photosynthesis')).toBeHidden()
        await expect(page.getByText('Nothing here yet')).toBeVisible()
    })

    test('opens the edit page from the card menu', async ({ page }) => {
        await mockCardApi(page, [
            {
                _id: 'card-1',
                front: 'Photosynthesis',
                back: 'Plants convert light into energy',
                folderId,
            },
        ])

        await page.goto(`/folder/${folderId}`)

        await page.locator('button[aria-haspopup="menu"]').first().click()
        await page.getByRole('menuitem', { name: 'Edit' }).click()

        await expect(page).toHaveURL(/\/card\/edit\/card-1$/)
    })

    test('creates cards from the folder create page', async ({ page }) => {
        let createPayload: unknown

        await mockCardApi(page, [])
        await page.route('**/api/auth/cards/add', async (route) => {
            createPayload = JSON.parse(route.request().postData() ?? '{}')
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            })
        })

        await page.goto(`/folder/create/${folderId}`)

        await page.locator('textarea').nth(0).fill('Term 1')
        await page.locator('textarea').nth(1).fill('Definition 1')
        await page.getByRole('button', { name: 'Save' }).click()

        await expect.poll(() => createPayload).toMatchObject({
            folderId,
            cards: [{ front: 'Term 1', back: 'Definition 1' }],
        })
        await expect(page).toHaveURL(new RegExp(`/folder/${folderId}$`))
    })

    test('validates that edited cards cannot be empty', async ({ page }) => {
        await mockCardApi(page, [
            {
                _id: 'card-1',
                front: 'Photosynthesis',
                back: 'Plants convert light into energy',
                folderId,
            },
        ])

        await page.goto('/card/edit/card-1')

        await page.locator('textarea').nth(0).fill('')
        await page.getByRole('button', { name: 'Edit card' }).click()

        await expect(
            page.getByText("Front and back can't be empty")
        ).toBeVisible()
        await expect(page).toHaveURL(/\/card\/edit\/card-1$/)
    })
})

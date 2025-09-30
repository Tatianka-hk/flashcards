import { useNuxtApp } from 'nuxt/app'
import type { ICard } from '../types/card'
export async function extractPdfText(file: File): Promise<string> {
    try {
        const { $pdfjs } = useNuxtApp() as any
        const pdfjsLib = $pdfjs as typeof import('pdfjs-dist')
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(arrayBuffer),
        }).promise

        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            fullText +=
                content.items.map((item: any) => item.str).join(' ') + '\n'
        }
        if (!fullText.trim()) {
            throw new Error('No text content found in PDF')
        }

        return fullText
    } catch (error) {
        throw error instanceof Error
            ? error
            : new Error('Failed to extract PDF text')
    }
}

export const downloadJSON = (cards: ICard[]) => {
    const dataStr = JSON.stringify(cards, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'flashcards.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

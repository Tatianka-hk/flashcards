import connectDB from '../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const { parentId = null } = getQuery(event) as {
        parentId?: string | null
    }
    try {
        await connectDB()
        const userId = event.context.userId
        if (!userId) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }
        const folders = await Folder.find({
            userId,
            parentId: parentId ?? null,
        })
        let name: string | null = null
        if (parentId) {
            const parent = await Folder.findOne({ _id: parentId })
            if (parent) {
                name = parent.name ?? null
            }
        }
        return { success: true, folders, name }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

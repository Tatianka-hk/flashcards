import connectDB from '../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const { parentId = null } = getQuery(event) as {
        parentId?: string | null
    }
    try {
        await connectDB()
        const userId = event.context.userId
        const folders = await Folder.find({
            userId,
            parentId: parentId ?? null,
        })
        return { success: true, folders }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

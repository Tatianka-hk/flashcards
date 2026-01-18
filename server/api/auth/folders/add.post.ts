import connectDB from '../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string
        parentId?: string
    }>(event)

    if (!body.name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing name',
        })
    }

    try {
        await connectDB()
        const userId = event.context.userId
        Folder.insertOne({
            name: body.name,
            parentId: body?.parentId && body?.parentId?.length > 0 ? body.parentId : null,
            userId: userId,
        })
        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

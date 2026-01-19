import connectDB from '../../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const folderId: string | undefined = getRouterParam(event, 'id')
    try {
        await connectDB()
        const userId = event.context.userId

        if (!userId) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }

        if (!folderId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing folder ID',
            })
        }

        const folder = await Folder.findOne({
            _id: folderId,
        })
        console.log(folder)

        if (!folder) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Folder not found',
            })
        }

        return { success: true, parent: folder.parentId }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

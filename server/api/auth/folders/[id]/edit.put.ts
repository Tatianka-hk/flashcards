import connectDB from '../../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string
    }>(event)

    const folderID: string | undefined = getRouterParam(event, 'id')
    if (!folderID) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing folder ID',
        })
    }

    if (!body.name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing name',
        })
    }

    try {
        await connectDB()
        const folder = await Folder.findOneAndUpdate(
            { _id: folderID },
            { $set: { name: body.name } }
        )
        if (!folder) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Folder not found',
            })
        }
        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

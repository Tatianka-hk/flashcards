import connectDB from '../../../../utils/db'
import { Folder } from '~/server/models/Folder'

async function deleteFolderRecursively(folderID: string) {
    const children = await Folder.find({ parentId: folderID }).select('_id')

    for (const child of children) {
        await deleteFolderRecursively(child._id.toString())
    }

    await Folder.deleteOne({ _id: folderID })
}

export default defineEventHandler(async (event) => {
    const folderID: string | undefined = getRouterParam(event, 'id')
    if (!folderID) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing folder ID',
        })
    }

    try {
        await connectDB()
        const exists = await Folder.exists({ _id: folderID })
        if (!exists) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Folder not found',
            })
        }

        await deleteFolderRecursively(folderID)

        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

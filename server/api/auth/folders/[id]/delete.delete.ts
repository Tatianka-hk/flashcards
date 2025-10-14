import connectDB from '../../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const folderID: string | undefined = getRouterParam(event, 'id')

    try {
        await connectDB()
        await Folder.deleteOne({ _id: folderID })
        return { success: true }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

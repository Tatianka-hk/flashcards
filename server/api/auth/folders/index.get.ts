import connectDB from '../../../utils/db'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    try {
        await connectDB()
        const userId = event.context.userId
        const folders = await Folder.find({
            userId,
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

import { trackUserEvent } from '~/server/services/analyticsService'
import connectDB from '../../../utils/db'
import { Folder } from '~/server/models/Folder'
import { EVENTS } from '~/static/analytic'
import { User } from '~/server/models/User'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        name: string
        parentId?: string
        lang: string
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
        const folder = await Folder.insertOne({
            name: body.name,
            parentId:
                body?.parentId && body?.parentId?.length > 0
                    ? body.parentId
                    : null,
            userId: userId,
            lang: body.lang,
        })

        const user = await User.findOne({ _id: userId })
        const email = user?.email

        await trackUserEvent({
            userId: userId,
            email: email ?? '',
            type: EVENTS.FOLDER_CREATE,
            data: {
                folderName: body.name,
                folderId: folder._id.toString(),
            },
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

import { Types } from 'mongoose'
import connectDB from '../../../../utils/db'
import { Card } from '~/server/models/Card'
import { Folder } from '~/server/models/Folder'

export default defineEventHandler(async (event) => {
    const folderId: string | undefined = getRouterParam(event, 'id')
    console.log(folderId)
    try {
        await connectDB()
        const userId = event.context.userId

        if (!userId) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized',
            })
        }
        const foldersColl = (Folder as any).collection.name
        const cardsColl = (Card as any).collection.name

        const res = await Folder.aggregate([
            { $match: { _id: new Types.ObjectId(folderId) } },

            // Витягнемо всіх нащадків (усі рівні глибини)
            {
                $graphLookup: {
                    from: foldersColl,
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parentId',
                    as: 'descendants',
                    depthField: 'depth',
                    maxDepth: 50,
                },
            },

            //  Зберемо масив усіх ID папок
            {
                $project: {
                    allFolderIds: {
                        $concatArrays: [
                            ['$_id'],
                            {
                                $map: {
                                    input: '$descendants',
                                    as: 'd',
                                    in: '$$d._id',
                                },
                            },
                        ],
                    },
                },
            },

            //Підтягнемо картки з будь-якої з цих папок
            {
                $lookup: {
                    from: cardsColl,
                    let: { ids: '$allFolderIds' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$folderId', '$$ids'] } } },
                        { $sort: { createdAt: -1, _id: 1 } },
                        {
                            $project: {
                                _id: 1,
                                front: 1,
                                back: 1,
                            },
                        },
                    ],
                    as: 'cards',
                },
            },
        ])
        console.log(res, 'cards: ', res?.[0]?.cards)
        return { success: true, cards: res?.[0]?.cards ?? [] }
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})

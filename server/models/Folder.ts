import { Schema, model } from 'mongoose'

const FolderSchema = new Schema(
    {
        name: String,
        lang: String,
        parentId: Schema.Types.ObjectId,
        userId: Schema.Types.ObjectId,
    },
    { bufferCommands: false }
)

export const Folder = model('Folder', FolderSchema)

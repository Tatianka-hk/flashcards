import { Schema, model } from 'mongoose'

const CardSchema = new Schema(
    {
        front: String,
        back: String,
        createdAt: Date,
        folderId: Schema.Types.ObjectId,
    },
    { bufferCommands: false }
)

export const Card = model('Card', CardSchema)

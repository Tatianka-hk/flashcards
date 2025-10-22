export interface ICard {
    _id?: string
    front: string
    back: string
}

export interface IDbCard extends ICard {
    createdAt: Date
    folderId: string
}

export interface IResult {
    cards: ICard[]
    name?: string
}

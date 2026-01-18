export interface IFolder {
    name: string
    parentId: string
    childrenFolders: IFolder[]
    _id: string
    lang: string
}

export interface IAnswer {
    cardId: string
    isCorrect: boolean
}

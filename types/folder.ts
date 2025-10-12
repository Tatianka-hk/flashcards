export interface IFolder {
    name: string
    parentId: string
    childrenFolders: IFolder[]
    _id: string
}

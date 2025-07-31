export interface ICard {
  front: string
  back: string
}

export interface IResult {
  cards: ICard[]
  name?: string
}

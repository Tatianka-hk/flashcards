class FlashCard {
  front: string
  back: string

  constructor(front: string, back: string) {
    if (!front.trim() || !back.trim()) {
      throw new Error('Both front and back content are required')
    }
    this.front = front.trim()
    this.back = back.trim()
  }
}

export { FlashCard }

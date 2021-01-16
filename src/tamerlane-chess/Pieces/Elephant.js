import NoneSlidePiece from '../NoneSlidePiece'


export default class Elephant extends NoneSlidePiece {
  constructor(row, col, color) {
    this.super(row, col, color)
    this.directions = [
      { rowDir: -2, colDir: 2 },
      { rowDir: 2, colDir: 2 },
      { rowDir: 2, colDir: -2 },
      { rowDir: -2, colDir: -2 },
    ]
  }
}

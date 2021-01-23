import NoneSlidePiece from './NoneSlidePiece'


export default class Elephant extends NoneSlidePiece {
  static _directions = [
    { rowDir: -2, colDir: 2 },
    { rowDir: 2, colDir: 2 },
    { rowDir: 2, colDir: -2 },
    { rowDir: -2, colDir: -2 },
  ]
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }
  get directions() {
    return Elephant._directions
  }
}

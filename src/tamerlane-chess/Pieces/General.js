import NoneSlidePiece from './NoneSlidePiece'

export default class General extends NoneSlidePiece {
  static _directions = [
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: -1, colDir: -1 },
  ]
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }
  get directions() {
    return General._directions
  }
}

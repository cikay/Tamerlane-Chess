import NoneSlidePiece from './NoneSlidePiece'

export default class General extends NoneSlidePiece {
  _directions = [
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: -1, colDir: -1 },
  ]
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }
  get directions() {
    return this._directions
  }
}

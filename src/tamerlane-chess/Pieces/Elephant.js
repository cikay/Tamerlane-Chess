import NoneSlidePiece from './NoneSlidePiece'


export default class Elephant extends NoneSlidePiece {
  _directions = [
    { rowDir: -2, colDir: 2 },
    { rowDir: 2, colDir: 2 },
    { rowDir: 2, colDir: -2 },
    { rowDir: -2, colDir: -2 },
  ]
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }
  get directions() {
    return this._directions
  }
}

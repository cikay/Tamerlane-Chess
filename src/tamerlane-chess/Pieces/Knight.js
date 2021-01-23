import NoneSlidePiece from './NoneSlidePiece'

export default class Knight extends NoneSlidePiece {
  static _directions = [
    { rowDir: -2, colDir: 1 },
    { rowDir: -1, colDir: 2 },
    { rowDir: 1, colDir: 2 },
    { rowDir: 2, colDir: 1 },
    { rowDir: 2, colDir: -1 },
    { rowDir: 1, colDir: -2 },
    { rowDir: -1, colDir: -2 },
    { rowDir: -2, colDir: -1 },
  ]
  get directions() {
    return Knight._directions
  }
}

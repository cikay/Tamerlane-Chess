import NoneSlidePiece from './NoneSlidePiece'

export default class Elephant extends NoneSlidePiece {
  static _directions = [
    { rowDir: -2, colDir: 2 },
    { rowDir: 2, colDir: 2 },
    { rowDir: 2, colDir: -2 },
    { rowDir: -2, colDir: -2 },
  ]
  static fenChar = 'f'
}

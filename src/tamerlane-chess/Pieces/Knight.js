import NoneSlidePiece from './NoneSlidePiece'

export default class Knight extends NoneSlidePiece {
  #directions = [
    { rowDir: -2, colDir: 1 },
    { rowDir: -1, colDir: 2 },
    { rowDir: 1, colDir: 2 },
    { rowDir: 2, colDir: 1 },
    { rowDir: 2, colDir: -1 },
    { rowDir: 1, colDir: -2 },
    { rowDir: -1, colDir: -2 },
    { rowDir: -2, colDir: -1 },
  ]
}

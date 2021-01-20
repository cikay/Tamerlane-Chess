export const COLUMNS = 'abcdefghijk'.split('')

export function fenToPieceCode(piece) {
  //black piece
  if (piece.toLowerCase() === piece) {
    return `b${piece.toUpperCase()}`
  }
  //white piece
  return `w${piece.toUpperCase()}`
}

export function objToFen(obj) {
  if (!validPositionObject(obj)) return false

  let fen = ''
  let currentRow = 10
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 11; j++) {
      let square = COLUMNS[j] + currentRow
      //piece exist
      if (obj.hasOwnProperty(square)) {
        fen = `${fen}${pieceCodeToFen(obj[square])}`
      } else {
        fen = `${fen}1`
      }
    }

    if (i !== 9) {
      fen = `${fen}/`
    }
    currentRow -= 1
  }
  fen = squeezeFenEmptySquares(fen)
  return fen
}

export function validFen(fen) {
  if (!isString(fen)) throw Error('Fen must be string')

  /*
  'f1d1i1i1d1f/kamzgsvzmak1/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK1/F1D1I1I1D1F*2 w'
  */

  //get citadelsFen
  //CITADEL FEN KONTROL EDİLECEK
  // let citadelsFen = fen.replace(/ .+$/, '')
  // citadelsFen = citadelsFen.replace(/.+\*/, '')

  // if(citadelsFen.length !== 2 && citadelsFen.length !== 1){
  //   citadelsFen = '11'
  // }
  // else if(citadelsFen.search(/[^]/)){

  // }
  // else if(citadelsFen !== '11'){
  //   throw Error("Citadels Fen is not valid")
  // }

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/\*.+$/, '')

  // expand the empty square numbers to just 1s
  fen = expandFenEmptySquares(fen)

  //Fen must be 10 sections seperated by slashes
  const chunks = fen.split('/')
  if (chunks.length !== 10)
    throw Error('Fen must be 10 sections seperated by slashes')

  //check each section
  /*
  'f1d1i1i1d1f/kamzgsvzmak1/pxcbyqehtnr/92/92/92/92
  /PXCBYQEHTNR/KAMZGSVZMAK1/F1D1I1I1D1F*2 w'
  */
  const pieceChars = 'fdikamzgsvzmakpxcbyqehtnrPXCBYQEHTNRFDIKAMZGSV1'.split('')
  for (const chunk of chunks) {
    //'f1d1i1i1d1f/kamzgsvzmak/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK/F1D1I1I1D1F*2 w'

    if (chunk.length !== 11) {
      throw Error('Fen each section must have 11 char')
    }
    for (const charPiece of chunk) {
      if (
        charPiece.search(
          /[^fdikamzgsvzmakpxcbyqehtnrPXCBYQEHTNRFDIKAMZGSV1]/
        ) !== -1
      ) {
        throw Error(`Each fen char must be one of them ${pieceChars}`)
      }
    }
  }

  return true
}

export function fenToObj(fen) {
  if (!validFen(fen)) return false
  //cut off any move castling, etc info from end
  //we are only interested in position information
  fen = fen.replace(/\*.+$/, '')

  const rows = fen.split('/')
  const position = {}
  let currentRow = 10
  for (let row of rows) {
    row = row.split('')
    let colIdx = 0

    for (const pieceChar of row) {
      //empty squares
      if (pieceChar.search(/[1-9]/) !== -1) {
        let numEmptySquares = parseInt(pieceChar)
        colIdx += numEmptySquares
      } else {
        //piece
        let square = `${COLUMNS[colIdx]}${currentRow}`
        position[square] = fenToPieceCode(pieceChar)

        colIdx += 1
      }
    }

    currentRow -= 1
  }
  console.log("position")
  console.log(position)
  return position
}

export function validPositionObject(pos) {
  if (pos === null || typeof pos !== 'object') return false
  for (const i in pos) {
    if (!pos.hasOwnProperty(i)) continue
    if (!validSquare(i) || !validPieceCode(pos[i])) {
      return false
    }
  }
  return true
}
//helper functions
function squeezeFenEmptySquares(fen) {
  return fen
    .replace(/111111111/g, '9')
    .replace(/11111111/g, '8')
    .replace(/1111111/g, '7')
    .replace(/111111/g, '6')
    .replace(/11111/g, '5')
    .replace(/1111/, '4')
    .replace(/111/, '3')
    .replace(/11/, '2')
}
function expandFenEmptySquares(fen) {
  return fen
    .replace(/9/g, '111111111')
    .replace(/8/g, '11111111')
    .replace(/7/g, '1111111')
    .replace(/6/g, '111111')
    .replace(/5/g, '11111')
    .replace(/4/g, '1111')
    .replace(/3/g, '111')
    .replace(/2/g, '11')
}
function validSquare(square) {
  return isString(square) && square.search(/^[a-k][1-10]$/) !== -1
}

function validPieceCode(code) {
  return isString(code) && code.search(/^[bw][FDIKAMZGSV]$/) !== -1
}

function pieceCodeToFen(piece) {
  const pieceCodeLetters = piece.split('')

  if (pieceCodeLetters[0] === 'w') {
    return pieceCodeLetters[1].toUpperCase()
  }
  return pieceCodeLetters[1].toLowerCase()
}

function isString(s) {
  return typeof s === 'string'
}

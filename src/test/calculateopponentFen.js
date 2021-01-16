function computeOpponentFen(fen) {
  const lastSlahIndex = fen.lastIndexOf('/')
  let opponentFen = ''
  for (let i = 0; i < fen.length; i++) {
    if (i === lastSlahIndex) {
      break
    }

    opponentFen = `${fen[i]}${opponentFen}`
  }
  let remainStringIndex = lastSlahIndex
  for (; remainStringIndex < fen.length; remainStringIndex++) {
    opponentFen = `${opponentFen}${fen[remainStringIndex]}`
  }

  return opponentFen
}
fen =
  'f1d1i1i1d1f/kamzgsvzmak1/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK1/F1D1I1I1D1F/ w'

const opponent = computeOpponentFen(fen)
console.log(opponent)

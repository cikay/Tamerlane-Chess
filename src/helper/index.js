export function getOpponentPlayer() {
  return JSON.parse(localStorage.getItem('opponentPlayer'))
}

export function getCurrentPlayer() {
  return JSON.parse(localStorage.getItem('currentPlayer'))
}

export function setOpponenPlayerToLocalStorage(opponentPlayer) {
  localStorage.setItem('opponentPlayer', JSON.stringify(opponentPlayer))
}

export function setCurrentPlayerToLocalStorage(currentPlayer) {
  localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer))
}

import { useCallback, useEffect, useState } from 'react'

const ROWS = 6
const COLS = 7
const COL_ORDER = [3, 2, 4, 5, 1, 0, 6]

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

/** Row 0 = top, ROWS-1 = bottom. */
function landingRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r -= 1) {
    if (!board[r][col]) {
      if (r === ROWS - 1 || board[r + 1][col] !== null) return r
    }
  }
  return -1
}

function drop(board, col, piece) {
  const r = landingRow(board, col)
  if (r < 0) return null
  const next = board.map((row) => [...row])
  next[r][col] = piece
  return next
}

function checkWinner(board) {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const p = board[r][c]
      if (p && p === board[r][c + 1] && p === board[r][c + 2] && p === board[r][c + 3]) return p
    }
  }
  for (let c = 0; c < COLS; c += 1) {
    for (let r = 0; r <= ROWS - 4; r += 1) {
      const p = board[r][c]
      if (p && p === board[r + 1][c] && p === board[r + 2][c] && p === board[r + 3][c]) return p
    }
  }
  for (let r = 0; r <= ROWS - 4; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      const p = board[r][c]
      if (p && p === board[r + 1][c + 1] && p === board[r + 2][c + 2] && p === board[r + 3][c + 3]) return p
    }
  }
  for (let r = 0; r <= ROWS - 4; r += 1) {
    for (let c = 3; c < COLS; c += 1) {
      const p = board[r][c]
      if (p && p === board[r + 1][c - 1] && p === board[r + 2][c - 2] && p === board[r + 3][c - 3]) return p
    }
  }
  return null
}

function boardFull(board) {
  for (let c = 0; c < COLS; c += 1) {
    if (!board[0][c]) return false
  }
  return true
}

function nextPlayer(board) {
  let rc = 0
  let kc = 0
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (board[r][c] === 'R') rc += 1
      if (board[r][c] === 'K') kc += 1
    }
  }
  return rc === kc ? 'R' : 'K'
}

function scoreWindowNeutral(cells) {
  const k = cells.filter((x) => x === 'K').length
  const r = cells.filter((x) => x === 'R').length
  const e = cells.filter((x) => !x).length
  if (k === 4) return 100
  if (r === 4) return -100
  if (k === 3 && e === 1 && r === 0) return 10
  if (r === 3 && e === 1 && k === 0) return -10
  if (k === 2 && e === 2 && r === 0) return 2
  if (r === 2 && e === 2 && k === 0) return -2
  return 0
}

function evaluateBoard(board) {
  let score = 0
  const addLine = (a, b, c, d) => {
    score += scoreWindowNeutral([a, b, c, d])
  }
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      addLine(board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3])
    }
  }
  for (let c = 0; c < COLS; c += 1) {
    for (let r = 0; r <= ROWS - 4; r += 1) {
      addLine(board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c])
    }
  }
  for (let r = 0; r <= ROWS - 4; r += 1) {
    for (let c = 0; c <= COLS - 4; c += 1) {
      addLine(board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3])
    }
  }
  for (let r = 0; r <= ROWS - 4; r += 1) {
    for (let c = 3; c < COLS; c += 1) {
      addLine(board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3])
    }
  }
  const mid = (COLS - 1) / 2
  for (let c = 0; c < COLS; c += 1) {
    for (let r = 0; r < ROWS; r += 1) {
      if (board[r][c] === 'K') score += 3 - Math.abs(c - mid) * 0.2
      if (board[r][c] === 'R') score -= 3 - Math.abs(c - mid) * 0.2
    }
  }
  return score
}

function minimaxAB(board, depth, alpha, beta, maximizing) {
  const w = checkWinner(board)
  if (w === 'K') return 1_000_000 + depth
  if (w === 'R') return -1_000_000 - depth
  if (boardFull(board)) return 0
  if (depth === 0) return evaluateBoard(board)

  const valid = COL_ORDER.filter((col) => landingRow(board, col) >= 0)

  if (maximizing) {
    let v = -Infinity
    for (const col of valid) {
      const next = drop(board, col, 'K')
      if (!next) continue
      v = Math.max(v, minimaxAB(next, depth - 1, alpha, beta, false))
      alpha = Math.max(alpha, v)
      if (alpha >= beta) break
    }
    return v
  }
  let v = Infinity
  for (const col of valid) {
    const next = drop(board, col, 'R')
    if (!next) continue
    v = Math.min(v, minimaxAB(next, depth - 1, alpha, beta, true))
    beta = Math.min(beta, v)
    if (alpha >= beta) break
  }
  return v
}

function bestBotMove(board) {
  const valid = COL_ORDER.filter((c) => landingRow(board, c) >= 0)
  if (valid.length === 0) return null

  for (const c of valid) {
    const next = drop(board, c, 'K')
    if (next && checkWinner(next) === 'K') return c
  }
  for (const c of valid) {
    const next = drop(board, c, 'R')
    if (next && checkWinner(next) === 'R') return c
  }

  let bestCol = valid[0]
  let bestScore = -Infinity
  for (const c of valid) {
    const next = drop(board, c, 'K')
    if (!next) continue
    const s = minimaxAB(next, 5, -Infinity, Infinity, false)
    if (s > bestScore) {
      bestScore = s
      bestCol = c
    }
  }
  return bestCol
}

export default function Connect4Game() {
  const [board, setBoard] = useState(emptyBoard)
  const [status, setStatus] = useState('Your turn — you are red (R)')

  const outcome = checkWinner(board) || (boardFull(board) ? 'draw' : null)

  const reset = useCallback(() => {
    setBoard(emptyBoard())
    setStatus('Your turn — you are red (R)')
  }, [])

  useEffect(() => {
    if (outcome === 'R') {
      setStatus('You win!')
      return
    }
    if (outcome === 'K') {
      setStatus('Kashish wins!')
      return
    }
    if (outcome === 'draw') {
      setStatus("It's a draw.")
      return
    }

    if (nextPlayer(board) !== 'K') {
      setStatus('Your turn — you are red (R)')
      return
    }

    setStatus('Kashish is thinking…')
    const id = window.setTimeout(() => {
      const col = bestBotMove(board)
      if (col == null) return
      setBoard((prev) => {
        const next = drop(prev, col, 'K')
        return next || prev
      })
    }, 380)

    return () => window.clearTimeout(id)
  }, [board, outcome])

  const onColumnClick = (col) => {
    if (outcome) return
    if (nextPlayer(board) !== 'R') return
    if (landingRow(board, col) < 0) return
    setBoard((prev) => {
      const next = drop(prev, col, 'R')
      return next || prev
    })
  }

  return (
    <div className="play-box play-box--c4">
      <h2 className="play-title">Connect 4</h2>
      <p className="play-subtitle">Four in a row — horizontal, vertical, or diagonal. You are Red, Kashish is Yellow.</p>
      <p className="play-status" role="status">
        {status}
      </p>

      <div className="c4-wrap">
        <div className="c4-drops" role="group" aria-label="Choose column to drop">
          {Array.from({ length: COLS }, (_, col) => (
            <button
              key={col}
              type="button"
              className="c4-drop"
              disabled={
                Boolean(outcome) || landingRow(board, col) < 0 || nextPlayer(board) !== 'R'
              }
              onClick={() => onColumnClick(col)}
              aria-label={`Drop in column ${col + 1}`}
            >
              {'\u25BC'}
            </button>
          ))}
        </div>
        <div className="c4-grid" aria-hidden="true">
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const piece = board[r][c]
              return (
                <div
                  key={`${r}-${c}`}
                  className={`c4-cell ${piece ? `c4-cell--${piece.toLowerCase()}` : ''}`}
                />
              )
            }),
          )}
        </div>
      </div>

      <button type="button" className="play-reset" onClick={reset}>
        New game
      </button>
    </div>
  )
}

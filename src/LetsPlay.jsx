import { useCallback, useEffect, useState } from 'react'

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const EMPTY = () => Array(9).fill(null)

function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

function isDraw(board) {
  return board.every((cell) => cell !== null)
}

function minimaxScore(board, isMaximizing) {
  const w = getWinner(board)
  if (w === 'O') return 1
  if (w === 'X') return -1
  if (isDraw(board)) return 0

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i += 1) {
      if (board[i]) continue
      const next = [...board]
      next[i] = 'O'
      best = Math.max(best, minimaxScore(next, false))
    }
    return best
  }
  let best = Infinity
  for (let i = 0; i < 9; i += 1) {
    if (board[i]) continue
    const next = [...board]
    next[i] = 'X'
    best = Math.min(best, minimaxScore(next, true))
  }
  return best
}

function bestBotMove(board) {
  let bestScore = -Infinity
  let move = -1
  for (let i = 0; i < 9; i += 1) {
    if (board[i]) continue
    const next = [...board]
    next[i] = 'O'
    const score = minimaxScore(next, false)
    if (score > bestScore) {
      bestScore = score
      move = i
    }
  }
  return move
}

function nextPlayer(board) {
  const xs = board.filter((c) => c === 'X').length
  const os = board.filter((c) => c === 'O').length
  return xs === os ? 'X' : 'O'
}

export default function LetsPlay() {
  const [board, setBoard] = useState(EMPTY)
  const [status, setStatus] = useState('Your turn — you are X')

  const outcome = getWinner(board) || (isDraw(board) ? 'draw' : null)

  const reset = useCallback(() => {
    setBoard(EMPTY())
    setStatus('Your turn — you are X')
  }, [])

  useEffect(() => {
    if (outcome === 'X') {
      setStatus('You win!')
      return
    }
    if (outcome === 'O') {
      setStatus('Bot wins!')
      return
    }
    if (outcome === 'draw') {
      setStatus("It's a draw.")
      return
    }

    const turn = nextPlayer(board)
    if (turn === 'X') {
      setStatus('Your turn — you are X')
      return
    }

    setStatus('Bot is thinking…')
    const id = window.setTimeout(() => {
      const move = bestBotMove(board)
      if (move < 0) return
      setBoard((prev) => {
        const next = [...prev]
        if (next[move]) return prev
        next[move] = 'O'
        return next
      })
    }, 350)

    return () => window.clearTimeout(id)
  }, [board, outcome])

  const onCellClick = (index) => {
    if (outcome) return
    if (nextPlayer(board) !== 'X') return
    if (board[index]) return
    setBoard((prev) => {
      const next = [...prev]
      next[index] = 'X'
      return next
    })
  }

  return (
    <main className="play-page">
      <div className="play-box">
        <h1 className="play-title">Let&apos;s Play</h1>
        <p className="play-subtitle">Tic-tac-toe — you are X, the bot is O</p>
        <p className="play-status" role="status">
          {status}
        </p>
        <div className="play-grid" aria-label="Tic-tac-toe board">
          {board.map((cell, i) => (
            <button
              key={i}
              type="button"
              className={`play-cell ${cell ? `play-cell--${cell.toLowerCase()}` : ''}`}
              onClick={() => onCellClick(i)}
              disabled={Boolean(outcome) || cell !== null || nextPlayer(board) !== 'X'}
              aria-label={cell ? `Cell ${i + 1}, ${cell}` : `Cell ${i + 1}, empty`}
            >
              {cell}
            </button>
          ))}
        </div>
        <button type="button" className="play-reset" onClick={reset}>
          New game
        </button>
      </div>
    </main>
  )
}

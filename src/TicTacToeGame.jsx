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
  if (w === 'K') return 1
  if (w === 'O') return -1
  if (isDraw(board)) return 0

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i += 1) {
      if (board[i]) continue
      const next = [...board]
      next[i] = 'K'
      best = Math.max(best, minimaxScore(next, false))
    }
    return best
  }
  let best = Infinity
  for (let i = 0; i < 9; i += 1) {
    if (board[i]) continue
    const next = [...board]
    next[i] = 'O'
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
    next[i] = 'K'
    const score = minimaxScore(next, false)
    if (score > bestScore) {
      bestScore = score
      move = i
    }
  }
  return move
}

function nextPlayer(board) {
  const os = board.filter((c) => c === 'O').length
  const ks = board.filter((c) => c === 'K').length
  return os === ks ? 'O' : 'K'
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState(EMPTY)
  const [status, setStatus] = useState('Your turn — you are O')

  const outcome = getWinner(board) || (isDraw(board) ? 'draw' : null)

  const reset = useCallback(() => {
    setBoard(EMPTY())
    setStatus('Your turn — you are O')
  }, [])

  useEffect(() => {
    if (outcome === 'O') {
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

    const turn = nextPlayer(board)
    if (turn === 'O') {
      setStatus('Your turn — you are O')
      return
    }

    setStatus('Kashish is thinking…')
    const id = window.setTimeout(() => {
      const move = bestBotMove(board)
      if (move < 0) return
      setBoard((prev) => {
        const next = [...prev]
        if (next[move]) return prev
        next[move] = 'K'
        return next
      })
    }, 350)

    return () => window.clearTimeout(id)
  }, [board, outcome])

  const onCellClick = (index) => {
    if (outcome) return
    if (nextPlayer(board) !== 'O') return
    if (board[index]) return
    setBoard((prev) => {
      const next = [...prev]
      next[index] = 'O'
      return next
    })
  }

  return (
    <div className="play-box">
      <h2 className="play-title">Tic-tac-toe</h2>
      <p className="play-subtitle">You are O, Kashish is K</p>
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
            disabled={Boolean(outcome) || cell !== null || nextPlayer(board) !== 'O'}
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
  )
}

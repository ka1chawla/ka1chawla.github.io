import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const SIZE = 8

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
}

function sosTripleKey(r1, c1, r2, c2, r3, c3) {
  const pts = [
    [r1, c1],
    [r2, c2],
    [r3, c3],
  ].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  return `${pts[0][0]},${pts[0][1]}|${pts[1][0]},${pts[1][1]}|${pts[2][0]},${pts[2][1]}`
}

function allSosKeys(board) {
  const keys = new Set()
  const addIf = (r1, c1, r2, c2, r3, c3) => {
    if (
      board[r1][c1] === 'S' &&
      board[r2][c2] === 'O' &&
      board[r3][c3] === 'S'
    ) {
      keys.add(sosTripleKey(r1, c1, r2, c2, r3, c3))
    }
  }
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c <= SIZE - 3; c += 1) {
      addIf(r, c, r, c + 1, r, c + 2)
    }
  }
  for (let r = 0; r <= SIZE - 3; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      addIf(r, c, r + 1, c, r + 2, c)
    }
  }
  for (let r = 0; r <= SIZE - 3; r += 1) {
    for (let c = 0; c <= SIZE - 3; c += 1) {
      addIf(r, c, r + 1, c + 1, r + 2, c + 2)
    }
  }
  for (let r = 0; r <= SIZE - 3; r += 1) {
    for (let c = 2; c < SIZE; c += 1) {
      addIf(r, c, r + 1, c - 1, r + 2, c - 2)
    }
  }
  return keys
}

function newSosCount(board, r, c, letter) {
  if (board[r][c]) return 0
  const prev = allSosKeys(board)
  const next = board.map((row) => [...row])
  next[r][c] = letter
  const after = allSosKeys(next)
  let added = 0
  after.forEach((k) => {
    if (!prev.has(k)) added += 1
  })
  return added
}

function clonePlace(board, r, c, letter) {
  const next = board.map((row) => [...row])
  next[r][c] = letter
  return next
}

function maxOpponentScoreOnBoard(board) {
  let maxScore = 0
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board[r][c]) continue
      for (const letter of ['S', 'O']) {
        maxScore = Math.max(maxScore, newSosCount(board, r, c, letter))
      }
    }
  }
  return maxScore
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function bestBotMove(board) {
  const empties = []
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (!board[r][c]) empties.push([r, c])
    }
  }
  if (empties.length === 0) return null

  let bestScore = -1
  const scoring = []
  for (const [r, c] of empties) {
    for (const letter of ['S', 'O']) {
      const pts = newSosCount(board, r, c, letter)
      if (pts > bestScore) {
        bestScore = pts
        scoring.length = 0
        scoring.push([r, c, letter])
      } else if (pts === bestScore) {
        scoring.push([r, c, letter])
      }
    }
  }
  if (bestScore > 0) {
    return pickRandom(scoring)
  }

  let minOpp = Infinity
  const blocking = []
  for (const [r, c] of empties) {
    for (const letter of ['S', 'O']) {
      const next = clonePlace(board, r, c, letter)
      const oppBest = maxOpponentScoreOnBoard(next)
      if (oppBest < minOpp) {
        minOpp = oppBest
        blocking.length = 0
        blocking.push([r, c, letter])
      } else if (oppBest === minOpp) {
        blocking.push([r, c, letter])
      }
    }
  }
  if (blocking.length) return pickRandom(blocking)
  const [r, c] = pickRandom(empties)
  return [r, c, pickRandom(['S', 'O'])]
}

function boardFull(board) {
  return board.every((row) => row.every((cell) => cell !== null))
}

export default function SOSGame() {
  const [board, setBoard] = useState(emptyBoard)
  const [scores, setScores] = useState({ user: 0, bot: 0 })
  const [turn, setTurn] = useState('user')
  const [letterPick, setLetterPick] = useState('S')
  const [thinking, setThinking] = useState(false)
  const [botChain, setBotChain] = useState(0)

  const boardRef = useRef(board)
  boardRef.current = board

  const done = boardFull(board)

  const displayStatus = useMemo(() => {
    if (done) {
      if (scores.user > scores.bot) return `Game over — you win ${scores.user}–${scores.bot}!`
      if (scores.bot > scores.user) return `Game over — Kashish wins ${scores.bot}–${scores.user}!`
      return `Game over — tie ${scores.user}–${scores.bot}`
    }
    if (thinking) return 'Kashish is thinking…'
    return 'Your turn — pick S or O, then tap a square'
  }, [done, scores.user, scores.bot, thinking])

  const reset = useCallback(() => {
    setBoard(emptyBoard())
    setScores({ user: 0, bot: 0 })
    setTurn('user')
    setLetterPick('S')
    setThinking(false)
    setBotChain(0)
  }, [])

  useEffect(() => {
    if (done || turn !== 'bot') {
      setThinking(false)
      return
    }

    setThinking(true)
    const id = window.setTimeout(() => {
      const prev = boardRef.current
      if (boardFull(prev)) {
        setThinking(false)
        return
      }
      const move = bestBotMove(prev)
      if (!move) {
        setThinking(false)
        return
      }
      const [r, c, letter] = move
      if (prev[r][c]) {
        setThinking(false)
        return
      }
      const pts = newSosCount(prev, r, c, letter)
      const next = clonePlace(prev, r, c, letter)
      setBoard(next)
      setScores((s) => ({ ...s, bot: s.bot + pts }))
           if (pts > 0 && !boardFull(next)) {
        setBotChain((n) => n + 1)
      } else {
        setTurn('user')
        setBotChain(0)
      }
      setThinking(false)
    }, 400)

    return () => window.clearTimeout(id)
  }, [turn, done, botChain])

  const onCellClick = (r, c) => {
    if (done || turn !== 'user' || board[r][c]) return
    const pts = newSosCount(board, r, c, letterPick)
    const next = clonePlace(board, r, c, letterPick)
    setBoard(next)
    setScores((s) => ({ ...s, user: s.user + pts }))
    if (pts > 0 && !boardFull(next)) {
      /* still user's turn */
    } else {
      setTurn('bot')
      setBotChain(0)
    }
  }

  return (
    <div className="play-box play-box--wide">
      <h2 className="play-title">SOS</h2>
      <p className="play-subtitle">
        Complete S–O–S in a row (any direction) to score. Whoever placed the finishing letter scores; same player
        goes again if they scored.
      </p>
      <p className="play-scores">
        You: <strong>{scores.user}</strong> · Kashish: <strong>{scores.bot}</strong>
      </p>
      <p className="play-status" role="status">
        {displayStatus}
      </p>

      <div className="sos-letter-pick" role="group" aria-label="Letter to place">
        <button
          type="button"
          className={`sos-pick-btn ${letterPick === 'S' ? 'sos-pick-btn--on' : ''}`}
          onClick={() => setLetterPick('S')}
          disabled={done || turn !== 'user'}
        >
          Place S
        </button>
        <button
          type="button"
          className={`sos-pick-btn ${letterPick === 'O' ? 'sos-pick-btn--on' : ''}`}
          onClick={() => setLetterPick('O')}
          disabled={done || turn !== 'user'}
        >
          Place O
        </button>
      </div>

      <div className="sos-grid" aria-label="SOS board 8 by 8">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className={`sos-cell ${cell === 'S' ? 'sos-cell--s' : cell === 'O' ? 'sos-cell--o' : ''}`}
              onClick={() => onCellClick(r, c)}
              disabled={Boolean(done) || cell !== null || turn !== 'user'}
              aria-label={cell ? `Row ${r + 1} column ${c + 1}, ${cell}` : `Row ${r + 1} column ${c + 1}, empty`}
            >
              {cell}
            </button>
          )),
        )}
      </div>
      <button type="button" className="play-reset" onClick={reset}>
        New game
      </button>
    </div>
  )
}

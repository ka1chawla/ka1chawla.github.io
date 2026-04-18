import { useState } from 'react'
import Connect4Game from './Connect4Game.jsx'
import SOSGame from './SOSGame.jsx'
import TicTacToeGame from './TicTacToeGame.jsx'

export default function LetsPlay() {
  const [game, setGame] = useState('ttt')

  return (
    <main className="play-page play-page--split">
      <aside className="play-sidebar">
        <h2 className="play-sidebar-heading">Select the Game to play with Kashish?</h2>
        <div className="play-game-picker">
          <button
            type="button"
            className={`play-game-btn ${game === 'ttt' ? 'play-game-btn--active' : ''}`}
            onClick={() => setGame('ttt')}
          >
            Tic-tac-toe
          </button>
          <button
            type="button"
            className={`play-game-btn ${game === 'sos' ? 'play-game-btn--active' : ''}`}
            onClick={() => setGame('sos')}
          >
            SOS game
          </button>
          <button
            type="button"
            className={`play-game-btn ${game === 'c4' ? 'play-game-btn--active' : ''}`}
            onClick={() => setGame('c4')}
          >
            Connect 4 Dots
          </button>
        </div>
      </aside>
      <section className="play-main" aria-live="polite">
        {game === 'ttt' ? <TicTacToeGame /> : game === 'sos' ? <SOSGame /> : <Connect4Game />}
      </section>
    </main>
  )
}

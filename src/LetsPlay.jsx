import { useState } from 'react'
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
        </div>
      </aside>
      <section className="play-main" aria-live="polite">
        {game === 'ttt' ? <TicTacToeGame /> : <SOSGame />}
      </section>
    </main>
  )
}

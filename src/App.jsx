import { useEffect, useMemo, useState } from 'react'

const LINES = [
  'kashishchawla@/home/kashish/>$ about Kashish Chawla',
  '>$ Job :  Software Engineer @DTDL',
  '>$ Skills : Java , Spring boot , AI learning , RDBMS , Kafka',
  '>$ Contact : kashishchawla121@gmail.com',
]

const CHAR_MS = 38
const LINE_PAUSE_MS = 280

export default function App() {
  const fullScript = useMemo(() => LINES.join('\n'), [])
  const [visibleChars, setVisibleChars] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let cancelled = false
    let i = 0
    let timeoutId

    const step = () => {
      if (cancelled) return
      if (i >= fullScript.length) return

      const ch = fullScript[i]
      i += 1
      setVisibleChars(i)

      const atLineBreak = ch === '\n'
      const delay = atLineBreak ? LINE_PAUSE_MS : CHAR_MS
      timeoutId = window.setTimeout(step, delay)
    }

    timeoutId = window.setTimeout(step, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [fullScript])

  useEffect(() => {
    const id = window.setInterval(() => {
      setShowCursor((c) => !c)
    }, 530)
    return () => window.clearInterval(id)
  }, [])

  const slice = fullScript.slice(0, visibleChars)
  const lines = slice.split('\n')

  return (
    <main className="page">
      <div className="page-left">
        <div className="terminal" aria-label="About Kashish Chawla">
          <div className="terminal-header">
            <span className="terminal-dot" />
            <span className="terminal-dot terminal-dot--amber" />
            <span className="terminal-dot terminal-dot--green" />
            <span className="terminal-title">kashishchawla -- ~/.zsh</span>
          </div>
          <pre className="terminal-body">
            {lines.map((line, idx) => (
              <span key={idx}>
                {line}
                {idx < lines.length - 1 ? '\n' : null}
              </span>
            ))}
            <span className={`terminal-cursor ${showCursor ? 'terminal-cursor--on' : ''}`}>▋</span>
          </pre>
        </div>
      </div>
      <div className="page-right">
        <header className="intro">
          <h0 className="intro-title">Kashish Chawla</h0>
          <h2 className="intro-subtitle">Software Engineer @DTDL</h2>
        </header>
      </div>
    </main>
  )
}

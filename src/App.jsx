import { useEffect, useMemo, useState } from 'react'

const LINES = [
  'kashishchawla@/home/kashish/>$ about Kashish Chawla',
  '>$ Job :  Software Engineer @DTDL',
  '>$ Skills : Java , Spring boot , AI learning , RDBMS , Kafka',
  '>$ Contact : kashishchawla121@gmail.com',
]

const PROMPT_USER = 'kashishchawla'
const PROMPT_PATH = '/home/kashish/>$'

/** After `>`, this whole prefix is red on the given line (typing-safe). */
const RED_AFTER_GT = {
  1: '$ Job',
  2: '$ Skills',
  3: '$ Contact',
}

/* Colored prompt segments; at-sign and dollar styled in the rest of each line. */
function terminalColoredSpans(line, lineIndex) {
  const full = LINES[lineIndex]
  if (!full.startsWith(line)) {
    return [<span key="f">{line}</span>]
  }

  const out = []
  let k = 0

  const pushRest = (s, keyBase) => {
    if (!s) return
    let part = ''
    const flushPart = (i) => {
      if (part) {
        out.push(
          <span key={`${keyBase}-t-${i}`} className="terminal-text">
            {part}
          </span>,
        )
        part = ''
      }
    }
    let flushId = 0
    for (let i = 0; i < s.length; i += 1) {
      const ch = s[i]
      if (ch === '@') {
        flushPart(flushId++)
        out.push(
          <span key={`${keyBase}-at-${i}`} className="terminal-at">
            @
          </span>,
        )
      } else if (ch === '$') {
        flushPart(flushId++)
        out.push(
          <span key={`${keyBase}-dol-${i}`} className="terminal-dollar">
            $
          </span>,
        )
      } else {
        part += ch
      }
    }
    flushPart(flushId)
  }

  if (lineIndex === 0) {
    const uLen = Math.min(line.length, PROMPT_USER.length)
    if (uLen > 0) {
      out.push(
        <span key="u" className="terminal-user">
          {line.slice(0, uLen)}
        </span>,
      )
      k = uLen
    }
    if (line.length <= k) return out

    if (line[k] === '@') {
      out.push(
        <span key="at" className="terminal-at">
          @
        </span>,
      )
      k += 1
    }
    if (line.length <= k) return out

    const pathLen = Math.min(line.length - k, PROMPT_PATH.length)
    const pathSlice = line.slice(k, k + pathLen)
    if (PROMPT_PATH.startsWith(pathSlice)) {
      out.push(
        <span key="path" className="terminal-path">
          {pathSlice}
        </span>,
      )
      k += pathLen
    }
    if (line.length <= k) return out

    pushRest(line.slice(k), 'r')
    return out
  }

  if (full.startsWith('>$')) {
    if (line.length > 0 && line[0] === '>') {
      out.push(
        <span key="gt" className="terminal-text">
          {'>'}
        </span>,
      )
      k = 1
    }
    if (line.length <= k) return out

    const redCmd = RED_AFTER_GT[lineIndex]
    const afterGt = line.slice(k)

    if (redCmd && full.slice(1).startsWith(redCmd)) {
      let matchLen = 0
      while (
        matchLen < afterGt.length &&
        matchLen < redCmd.length &&
        afterGt[matchLen] === redCmd[matchLen]
      ) {
        matchLen += 1
      }
      if (matchLen > 0) {
        out.push(
          <span key="cmd" className="terminal-dollar">
            {afterGt.slice(0, matchLen)}
          </span>,
        )
        k += matchLen
      }
      if (line.length > k) {
        pushRest(line.slice(k), 'tail')
      }
      return out
    }

    if (line[k] === '$') {
      out.push(
        <span key="dol" className="terminal-dollar">
          $
        </span>,
      )
      k += 1
    }
    if (line.length > k) {
      pushRest(line.slice(k), 'tail')
    }
    return out
  }

  pushRest(line, 'all')
  return out
}

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
                {terminalColoredSpans(line, idx)}
                {idx < lines.length - 1 ? '\n' : null}
              </span>
            ))}
            <span className={`terminal-cursor ${showCursor ? 'terminal-cursor--on' : ''}`}>▋</span>
          </pre>
        </div>
      </div>
      <div className="page-right">
        <header className="intro">
          <h1 className="intro-title">Kashish Chawla</h1>
          <h2 className="intro-subtitle">Software Engineer @DTDL</h2>
        </header>
      </div>
    </main>
  )
}

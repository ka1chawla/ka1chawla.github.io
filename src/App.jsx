import { useEffect, useState } from 'react'
import About from './About.jsx'
import Home from './Home.jsx'
import LetsPlay from './LetsPlay.jsx'
import Blogs from './Blogs.jsx'

function routeFromHash() {
  const h = window.location.hash.replace(/^#/, '')
  if (h === '/about' || h === 'about') return 'about'
  if (h === '/play' || h === 'play') return 'play'
  if (h === '/blogs' || h === 'blogs') return 'blogs'
  return 'home'
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash)

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <>
      <nav className="site-nav" aria-label="Site">
        <a className={`site-nav-link ${route === 'home' ? 'site-nav-link--current' : ''}`} href="#/">
          Home
        </a>
        <a
          className={`site-nav-link ${route === 'about' ? 'site-nav-link--current' : ''}`}
          href="#/about"
        >
          Meet Me
        </a>
        <a
          className={`site-nav-link ${route === 'play' ? 'site-nav-link--current' : ''}`}
          href="#/play"
        >
          Let&apos;s Play
        </a>
      </nav>
      {route === 'about' ? <About /> : route === 'play' ? <LetsPlay /> : route === 'blogs' ? <Blogs /> : <Home />}
    </>
  )
}

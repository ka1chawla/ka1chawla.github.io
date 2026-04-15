import { useEffect } from 'react'

const SCROLL_KEY = 'aboutScrollTo'

const SECTION_IDS = {
  technical: 'technical-experience',
  education: 'education',
  life: 'life-beyond-code',
}

function isAboutRoute() {
  const h = window.location.hash.replace(/^#/, '')
  return h === '/about' || h === 'about'
}

function SectionLink({ sectionId, children }) {
  const handleClick = (e) => {
    e.preventDefault()
    if (!isAboutRoute()) {
      sessionStorage.setItem(SCROLL_KEY, sectionId)
      window.location.hash = '#/about'
      return
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <a href="#/about" onClick={handleClick} className="about-inline-link">
      {children}
    </a>
  )
}

export default function About() {
  useEffect(() => {
    const id = sessionStorage.getItem(SCROLL_KEY)
    if (!id) return undefined
    const t = window.setTimeout(() => {
      sessionStorage.removeItem(SCROLL_KEY)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [])

  const photoSrc = `${import.meta.env.BASE_URL}beachPhotoKashish.jpeg`

  return (
    <main className="about-page">
      <div className="about-hero">
        <div className="about-photo-col">
          <img className="about-photo" src={photoSrc} alt="Kashish at the beach" loading="lazy" />
        </div>
        <div className="about-text-col">
          <div className="about-intro">
            <p className="about-intro-p">
              I am a software engineer with over 7 years of experience in India’s tech landscape. I’m glad you’re
              here to learn more about my journey—one driven by a commitment to Kaizen, the philosophy of continuous
              improvement in both code and life.
            </p>
            <p className="about-intro-p">You can dive deeper into the different chapters of my story below:</p>
            <p className="about-intro-p about-intro-p--tight">
              <SectionLink sectionId={SECTION_IDS.technical}>Technical Experience</SectionLink>: A breakdown of the
              stacks I’ve mastered and the projects I’ve led.
            </p>
            <p className="about-intro-p about-intro-p--tight">
              <SectionLink sectionId={SECTION_IDS.education}>Education</SectionLink>: The academic foundation that
              started my journey in technology.
            </p>
            <p className="about-intro-p about-intro-p--tight">
              <SectionLink sectionId={SECTION_IDS.life}>Life Beyond Code</SectionLink>: My adventures in travel,
              social interests, and the hobbies that keep me balanced.
            </p>
          </div>
        </div>
      </div>

      <div className="about-details">
        <section id={SECTION_IDS.technical} className="about-section" aria-labelledby="heading-technical">
          <h2 id="heading-technical" className="about-section-title">
            Technical Experience
          </h2>
          <p className="about-section-body">
            Currently, I am working with DTDL as software developer on their Fintech platform for Europe. I have been working with DTDL since past 4.5 years.
            Before fintech platform , I have also worked on DTDL's E-commerce platform for Europe.

            Prior to joining DTDL I had 3 years of experience in India with companies like Payu Payments, Airtel etc.
          </p>
        </section>

        <section id={SECTION_IDS.education} className="about-section" aria-labelledby="heading-education">
          <h2 id="heading-education" className="about-section-title">
            Education
          </h2>
          <p className="about-section-body">
            I have an Engineering Degree from NSIT (Netaji Subhash Institute of Technology) with major in IT ( Information & Technology).
            My High school & Junior school has been completed from HM Dav sr. sec School & DCM sr sec school,Ferozepur,Punjab.
          </p>
        </section>

        <section id={SECTION_IDS.life} className="about-section" aria-labelledby="heading-life">
          <h2 id="heading-life" className="about-section-title">
            Life Beyond Code
          </h2>
          <p className="about-section-body">
            Travel, people, and offline hobbies keep me grounded and curious—often the same curiosity I bring to
            debugging and design.</p>
          <p className="about-section-body"></p>
          <p className="about-section-body">Having a goal to travel all the states of India , I have travelled 10 out of 28 states & 3 out of 9 UT's of India.
          </p>
        </section>
      </div>
    </main>
  )
}

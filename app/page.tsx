import {
  education,
  experience,
  familiar,
  kudos,
  profile,
  projects,
  sideProjects,
  skills,
  stats,
  teaching,
  trackRecord,
} from "./content";

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="brand">
            {profile.name}
          </a>
          <nav aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#projects">Projects</a>
            <a href="#recognition">Recognition</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="wrap hero">
          <p className="eyebrow">{profile.title}</p>
          <h1>{profile.tagline}</h1>
          <p className="lede">{profile.intro}</p>
          <div className="cta">
            <a className="btn primary" href="#work">
              See my work
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
            <a className="btn" href={profile.resume} download>
              Download resume
            </a>
          </div>
          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="wrap section">
          <h2>Selected work</h2>
          <div className="grid">
            {projects.map((p) => (
              <article key={p.title} className="card">
                <p className="meta">{p.period}</p>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <ul>
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <ul className="tags" aria-label="Technologies">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="wrap section">
          <h2>Side projects &amp; teaching</h2>
          <div className="grid">
            {sideProjects.map((p) => (
              <article key={p.title} className="card">
                <p className="meta">{p.period}</p>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                {p.points.length > 0 && (
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
                <ul className="tags" aria-label="Technologies">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {p.href && (
                  <p className="repo">
                    <a href={p.href} rel="noopener noreferrer">
                      View on GitHub →
                    </a>
                  </p>
                )}
              </article>
            ))}
            {teaching.map((t) => (
              <article key={t.title} className="card">
                <p className="meta">{t.role}</p>
                <h3>{t.title}</h3>
                <p>{t.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="recognition" className="wrap section">
          <h2>Recognition</h2>
          <div className="grid">
            {kudos.map((k) => (
              <figure key={k.text} className="card quote">
                <p>{k.text}</p>
                <figcaption>
                  <strong>{k.from}</strong>
                  <span className="meta">{k.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <h3 className="sub">Track record</h3>
          <ul className="bonafides">
            {trackRecord.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section id="experience" className="wrap section">
          <h2>Experience</h2>
          <div className="timeline">
            {experience.map((e) => (
              <article key={e.company}>
                <div className="row">
                  <h3>
                    {e.role} <span className="at">· {e.company}</span>
                  </h3>
                  <p className="meta">{e.period}</p>
                </div>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <h3 className="sub">Education</h3>
          <ul className="edu">
            {education.map((e) => (
              <li key={e.name}>
                <span>
                  <strong>{e.name}</strong>, {e.detail}
                </span>
                <span className="meta">{e.date}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="skills" className="wrap section">
          <h2>Skills</h2>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.group}>
                <h3>{g.group}</h3>
                <ul className="tags">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 className="sub">Working familiarity</h3>
          <ul className="tags">
            {familiar.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </section>

        <section id="contact" className="wrap section contact">
          <h2>Let&apos;s talk</h2>
          <p className="lede">
            Looking for hands-on engineering roles where I can build, with a
            lean toward climate, conservation and teams that integrate AI into
            how they work. The fastest way to reach me is email.
          </p>
          <div className="cta">
            <a className="btn primary" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a className="btn" href={profile.resume} download>
              Resume (PDF)
            </a>
            <a className="btn" href={profile.github} rel="noopener noreferrer">
              GitHub
            </a>
            <a className="btn" href={profile.linkedin} rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <p>© {profile.name}</p>
      </footer>
    </>
  );
}

import SunLeaf from "./components/SunLeaf";
import ThemeShuffle from "./components/ThemeShuffle";
import Vine from "./components/Vine";
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

const pad = (n: number) => String(n).padStart(2, "0");

// English label + Japanese label for each "sign".
const nav = [
  { id: "work", en: "Work", jp: "作品" },
  { id: "projects", en: "Projects", jp: "個人開発" },
  { id: "praise", en: "Praise", jp: "評価" },
  { id: "log", en: "Record", jp: "実績" },
  { id: "career", en: "Career", jp: "経歴" },
  { id: "skills", en: "Skills", jp: "スキル" },
  { id: "contact", en: "Contact", jp: "連絡" },
];

const shortSkills = skills.flatMap((g) => g.items).filter((i) => i.length <= 18);

function Sign({ n }: { n: number }) {
  const s = nav[n];
  return (
    <header className="sign-head">
      <p className="sign-no">No.{pad(n + 1)}</p>
      <h2>{s.en}</h2>
      <span className="sign-jp" lang="ja">
        {s.jp}
      </span>
    </header>
  );
}

function Run({ items, sep }: { items: string[]; sep: string }) {
  return (
    <>
      {[0, 1].map((n) => (
        <span key={n} className="run-set">
          {items.map((t) => (
            <span key={`${n}-${t}`}>
              {t}
              <i>{sep}</i>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <div className="page">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <p className="vert" aria-hidden="true" lang="ja">
        ソフトウェアエンジニア・ポートフォリオ
      </p>

      <header className="top">
        <div className="wrap top-in">
          <a href="#top" className="logo" aria-label={`${profile.name}, back to top`}>
            <span>KM</span>
          </a>
          <nav aria-label="Sections" className="top-nav">
            {nav.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.en}
                <span lang="ja">{s.jp}</span>
              </a>
            ))}
          </nav>
          <ThemeShuffle />
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero wrap">
          <div className="hero-text">
            <p className="hud">
              <span className="dot" aria-hidden="true" /> SYS.ONLINE // 35.6595°N 139.7004°E
            </p>
            <h1 className="name">
              <span>Kawika</span> <span className="name-2">Miller</span>
            </h1>
            <p className="role">
              <span lang="ja">ソフトウェアエンジニア</span>
              <b aria-hidden="true">/</b>
              {profile.title}
            </p>
            <p className="tagline">{profile.tagline}</p>
            <p className="intro">{profile.intro}</p>
            <p className="actions">
              <a className="btn primary" href={`mailto:${profile.email}`}>
                Say hello
              </a>
              <a className="btn" href={profile.resume} download>
                Resume PDF
              </a>
              <a className="btn" href={profile.github} rel="noopener noreferrer">
                GitHub
              </a>
              <a className="btn" href={profile.linkedin} rel="noopener noreferrer">
                LinkedIn
              </a>
            </p>
          </div>

          <aside className="billboard" aria-label="Availability">
            <SunLeaf className="bb-art" />
            <p className="bb-top">Open to roles</p>
            <p className="bb-jp" lang="ja">
              お仕事募集中
            </p>
            <p className="bb-meta">Hands-on engineering · .NET · TypeScript · AWS</p>
          </aside>
        </section>

        <div className="crossing" aria-hidden="true">
          <div className="band band-a">
            <div className="band-track">
              <Run
                items={["お仕事募集中", "OPEN TO ROLES", "ハンズオン・エンジニアリング", "HANDS-ON ENGINEERING"]}
                sep="✦"
              />
            </div>
          </div>
          <div className="band band-b">
            <div className="band-track reverse">
              <Run items={shortSkills} sep="//" />
            </div>
          </div>
        </div>

        <dl className="readouts wrap" aria-label="At a glance">
          {stats.map((s) => (
            <div key={s.label}>
              <dd>{s.value}</dd>
              <dt>{s.label}</dt>
            </div>
          ))}
        </dl>

        <section id="work" className="sec wrap">
          <Sign n={0} />
          <Vine />
          <div className="posters">
            {projects.map((p, i) => (
              <article key={p.title} className={`poster c${i % 3}`}>
                <div className="poster-side">
                  <p className="poster-no">{pad(i + 1)}</p>
                  <p className="poster-period">{p.period}</p>
                  <ul className="stack" aria-label="Technologies">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="poster-body">
                  <h3>{p.title}</h3>
                  <p className="sum">{p.summary}</p>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="sec wrap">
          <Sign n={1} />
          <Vine />
          <div className="shops">
            {sideProjects.map((p, i) => (
              <article key={p.title} className={`shop c${i % 3}`}>
                <h3>
                  {p.href ? (
                    <a href={p.href} rel="noopener noreferrer">
                      {p.title} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
                <div className="shop-body">
                  <p className="meta">{p.period}</p>
                  <p>{p.summary}</p>
                  {p.points.length > 0 && (
                    <ul>
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  <p className="meta tags">{p.tags.join(" · ")}</p>
                </div>
              </article>
            ))}
            {teaching.map((t, i) => (
              <article key={t.title} className={`shop c${(sideProjects.length + i) % 3}`}>
                <h3>{t.title}</h3>
                <div className="shop-body">
                  <p className="meta">{t.role}</p>
                  <p>{t.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="praise" className="sec wrap">
          <Sign n={2} />
          <Vine />
          <div className="neons">
            {kudos.map((k, i) => (
              <figure key={k.text} className={`neon c${i % 3}`}>
                <blockquote>{k.text}</blockquote>
                <figcaption>
                  <b>{k.from}</b>
                  <span>{k.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="fine">Paraphrased from internal messages and attributed by role.</p>
        </section>

        <section id="log" className="sec wrap">
          <Sign n={3} />
          <Vine />
          <ol className="log">
            {trackRecord.map((t, i) => (
              <li key={t}>
                <span className="n">[{pad(i + 1)}]</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="career" className="sec wrap">
          <Sign n={4} />
          <Vine />
          <ol className="metro">
            {experience.map((e) => (
              <li key={e.company}>
                <p className="when">{e.period}</p>
                <h3>
                  {e.role} <span className="at">@ {e.company}</span>
                </h3>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
            {education.map((e) => (
              <li key={e.name} className="edu">
                <p className="when">{e.date}</p>
                <h3>
                  {e.name} <span className="at">· Education</span>
                </h3>
                <p>{e.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="skills" className="sec wrap">
          <Sign n={5} />
          <Vine />
          <dl className="rack">
            {skills.map((g, gi) => (
              <div key={g.group} className={`c${gi % 3}`}>
                <dt>{g.group}</dt>
                <dd>
                  {g.items.map((i) => (
                    <span key={i}>{i}</span>
                  ))}
                </dd>
              </div>
            ))}
            <div className="also">
              <dt>Also encountered</dt>
              <dd>
                {familiar.map((i) => (
                  <span key={i}>{i}</span>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <section id="contact" className="sec wrap contact">
          <Sign n={6} />
          <Vine />
          <div className="open-sign">
            <p className="open" aria-hidden="true">
              OPEN
            </p>
            <div>
              <p className="contact-lede">
                Looking for hands-on engineering roles where I can build, with a lean toward climate,
                conservation and teams that integrate AI into how they work.
              </p>
              <p className="contact-mail">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
              <p className="actions">
                <a className="btn primary" href={`mailto:${profile.email}`}>
                  Say hello
                </a>
                <a className="btn" href={profile.github} rel="noopener noreferrer">
                  GitHub
                </a>
                <a className="btn" href={profile.linkedin} rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a className="btn" href={profile.resume} download>
                  Resume PDF
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap foot">
        <span>© {profile.name}</span>
        <span>Colors shuffle with the button in the top bar.</span>
      </footer>
    </div>
  );
}

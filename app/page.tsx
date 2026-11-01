import Barcode from "./components/Barcode";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./components/Icons";
import ProfileDie from "./components/ProfileDie";
import ModeToggle from "./components/ModeToggle";
import ThemeShuffle from "./components/ThemeShuffle";
import ThemeSwitch from "./components/ThemeSwitch";
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

// The order of this list is the order of the page: it drives the top nav, the SEC.0n numbers and
// the entry counts. To reorder the page, move an entry here and move its <section> below to match.
const sections = [
  { id: "skills", label: "Skills", count: skills.length + 1 },
  { id: "kudos", label: "Kudos", count: kudos.length },
  { id: "career", label: "Career", count: experience.length + teaching.length + education.length },
  { id: "work", label: "Work", count: projects.length },
  { id: "log", label: "Record", count: trackRecord.length },
  { id: "projects", label: "Projects", count: sideProjects.length },
  { id: "contact", label: "Contact", count: null as number | null },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Whole months between the two ends of a "Mon YYYY – Mon YYYY" period.
function monthsIn(period: string) {
  const at = (s: string) => {
    const [m, y] = s.split(" ");
    return Number(y) * 12 + MONTHS.indexOf(m);
  };
  const [a, b] = period.split(" – ");
  return at(b) - at(a);
}

const eduCodes = ["CERT.01", "DEG.01"];

const shortSkills = skills.flatMap((g) => g.items).filter((i) => i.length <= 18);

function Sign({ id }: { id: string }) {
  const n = sections.findIndex((x) => x.id === id);
  const { label, count } = sections[n];
  return (
    <>
      <header className="sign-head">
        <p className="sign-no">SEC.{pad(n + 1)}</p>
        <h2>{label}</h2>
        <p className="sign-meta">{count === null ? "[ OPEN ]" : `[ ${pad(count)} ENTRIES ]`}</p>
      </header>
      <div className="rule" aria-hidden="true">
        <i />
        <i />
        <i />
        <b />
        <u />
      </div>
    </>
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

      <p className="vert" aria-hidden="true">
        Kawika Miller // Full stack software engineer // Portfolio 2026 // Rev.A
      </p>
      <p className="vert right" aria-hidden="true">
        .NET // TypeScript // AWS // Terraform // Security // AI-assisted engineering
      </p>

      <header className="top">
        <div className="wrap top-in">
          <a href="#top" className="logo" aria-label={`${profile.name}, back to top`}>
            <span>KM</span>
          </a>
          <nav aria-label="Sections" className="top-nav">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </nav>
          <ThemeShuffle />
          <ModeToggle />
          <ThemeSwitch />
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero wrap">
          <div className="shapes" aria-hidden="true">
            <i className="sh-circle" />
            <i className="sh-quarter" />
            <i className="sh-tri" />
            <span className="sh-stripes">
              <b />
              <b />
              <b />
            </span>
          </div>

          <div className="hero-text">
            <p className="hud">
              <span className="dot" aria-hidden="true" /> SYS.ONLINE // KM-2026 // REV.A
            </p>
            <h1 className="name">
              <span>Kawika</span> <span className="name-2">Miller</span>
            </h1>
            <p className="role">{profile.title}</p>
            <p className="tagline">{profile.tagline}</p>
            <p className="intro">{profile.intro}</p>
            <p className="actions">
              <a className="btn primary" href={`mailto:${profile.email}`}>
                <MailIcon />
                Email me
              </a>
              <a className="btn" href={profile.resume} target="_blank" rel="noopener noreferrer">
<DownloadIcon />
Resume PDF
<span className="sr-only"> (opens in a new tab)</span>
</a>
              <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">
<GitHubIcon />
GitHub
<span className="sr-only"> (opens in a new tab)</span>
</a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
<LinkedInIcon />
LinkedIn
<span className="sr-only"> (opens in a new tab)</span>
</a>
            </p>
          </div>

          <aside className="billboard" aria-label="Availability">
            <p className="bb-row">
              <span>Status</span>
              <b>Available</b>
            </p>
            <ProfileDie />
            <p className="bb-top">Open to work</p>
            <div className="bb-code">
              <Barcode seed={11} />
              <span>KM-2026-A</span>
            </div>
          </aside>
        </section>

        <div className="crossing" aria-hidden="true">
          <div className="band band-a">
            <div className="band-track">
              <Run
                items={["OPEN TO WORK", "FULL STACK ENGINEER", ".NET / TYPESCRIPT / AWS"]}
                sep="///"
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

        <section id="skills" className="sec wrap">
          <Sign id="skills" />
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

        <section id="kudos" className="sec wrap">
          <Sign id="kudos" />
          <div className="neons">
            {kudos.map((k, i) => (
              <figure key={k.text} className={`neon c${i % 3}`}>
                <div className="neon-head" aria-hidden="true">
                  <span>RX.{pad(i + 1)}</span>
                  <span className="sig">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
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

        <section id="career" className="sec wrap">
          <Sign id="career" />
          <ol className="metro">
            {experience.map((e, i) => (
              <li key={e.company}>
                <p className="when">
                  <span className="tag">DEPLOY.{pad(experience.length - i)}</span>
                  {e.period}
                  <span className="dur">[ {pad(monthsIn(e.period))} MO ]</span>
                </p>
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
            {teaching.map((t, i) => (
              <li key={t.title} className="edu">
                <p className="when">
                  <span className="tag">TEACH.{pad(i + 1)}</span>
                  {t.period}
                </p>
                <h3>
                  {t.title} <span className="at">· {t.role}</span>
                </h3>
                <p>{t.summary}</p>
              </li>
            ))}
            {education.map((e, i) => (
              <li key={e.name} className="edu">
                <p className="when">
                  <span className="tag">{eduCodes[i] ?? "CERT"}</span>
                  {e.date}
                </p>
                <h3>
                  {e.name} <span className="at">· Education</span>
                </h3>
                <p>{e.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="work" className="sec wrap">
          <Sign id="work" />
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
                  <header className="poster-head">
                    <h3>{p.title}</h3>
                    <p className="sum">{p.summary}</p>
                  </header>
                  <div className="poster-points">
                    <p className="points-label">
                      <span>Highlights</span>
                      <span aria-hidden="true">[ {pad(p.points.length)} ]</span>
                    </p>
                    <ul>
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="log" className="sec wrap">
          <Sign id="log" />
          <div className="term">
            <div className="term-bar" aria-hidden="true">
              <span className="term-dots">
                <i />
                <i />
                <i />
              </span>
              <b>DEBRIEF.LOG</b>
              <em>
                {pad(trackRecord.length)} RECORDS {"//"} CLEARANCE: PUBLIC
              </em>
            </div>
            <ol className="log">
              {trackRecord.map((t, i) => (
                <li key={t}>
                  <span className="n">[{pad(i + 1)}]</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="projects" className="sec wrap">
          <Sign id="projects" />
          <div className="shops">
            {sideProjects.map((p, i) => (
              <article key={p.title} className={`shop c${i % 3}`}>
                <div className="shop-head">
                  <h3>
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer">
                        {p.title} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <span className="code" aria-hidden="true">
                    P.{pad(i + 1)}
                  </span>
                </div>
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
          </div>
        </section>

        <section id="contact" className="sec wrap contact">
          <Sign id="contact" />
          <div className="comms">
            <div className="comms-bar" aria-hidden="true">
              <span>COMMS {"//"} CHANNEL OPEN</span>
              <span>KM-2026</span>
            </div>
            <div className="open-sign">
              <p className="open" aria-hidden="true">
                OPEN
              </p>
              <div>
                <p className="contact-lede">
                  Looking for engineering or engineering-management roles, with a lean toward climate,
                  conservation and teams that integrate AI into how they work.
                </p>
                <p className="contact-mail">
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </p>
                <p className="actions">
                  <a className="btn primary" href={`mailto:${profile.email}`}>
                    <MailIcon />
                Email me
                  </a>
                  <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">
<GitHubIcon />
GitHub
<span className="sr-only"> (opens in a new tab)</span>
</a>
                  <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
<LinkedInIcon />
LinkedIn
<span className="sr-only"> (opens in a new tab)</span>
</a>
                  <a className="btn" href={profile.resume} target="_blank" rel="noopener noreferrer">
<DownloadIcon />
Resume PDF
<span className="sr-only"> (opens in a new tab)</span>
</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="hazard" aria-hidden="true" />
      <footer className="wrap foot">
        <span>
          © {profile.name} {"//"} KM-2026 {"//"} Rev.A
        </span>
        <span className="foot-code" aria-hidden="true">
          <Barcode seed={3} />
        </span>
        <span>Colors shuffle with the button in the top bar.</span>
      </footer>
    </div>
  );
}

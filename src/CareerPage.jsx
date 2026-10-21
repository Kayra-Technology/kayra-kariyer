import { useEffect } from "react";
import { asset } from "./asset";
import { jobs } from "./jobs";
import { sections } from "./sections";
import { ApplyMenu } from "./ApplyMenu";
import { bullet, pad } from "./posting";

const location = "İTÜ Özdemir Bayraktar Tasarım ve Prototipleme Merkezi";

function SectionTabs() {
  return (
    <nav className="section-tabs" aria-label="Kayra bölümleri">
      {sections.map((section) => (
        <a key={section.id} href={section.href} aria-current={section.id === "kariyer" ? "page" : undefined}>{section.label}</a>
      ))}
    </nav>
  );
}

const List = ({ items }) => <ul className="career-list">{items.map((item) => <li key={item}>{bullet(item)}</li>)}</ul>;

/** Technical skills: titled groups as cards, or one untitled list when the posting has no groups. */
function Skills({ skills }) {
  if (skills.length === 1 && !skills[0][0]) return <List items={skills[0][1]} />;
  return (
    <div className="career-skill-grid">
      {skills.map(([group, items], index) => (
        <article key={group} className="career-skill">
          <span className="career-skill-index">{pad(index + 1)}</span>
          <h4>{group}</h4>
          <List items={items} />
        </article>
      ))}
    </div>
  );
}

/** One open position: summary and apply button always visible, the full posting behind "İlanın tamamı". */
function Posting({ job, index }) {
  const titleId = `${job.id}-title`;
  return (
    <article className="career-job" aria-labelledby={titleId}>
      <p className="kicker"><span /> {pad(index + 1)} / AÇIK POZİSYON</p>
      <h2 id={titleId}>{job.title}</h2>
      <p className="career-summary">{job.summary}</p>
      <dl className="career-meta">
        {job.meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <ApplyMenu apply={job.apply} label="Başvur" />

      <details className="career-details">
        <summary>İlanın tamamı</summary>
        <section className="career-section">
          <h3>Aranan nitelikler</h3>
          <List items={job.requirements} />
        </section>
        <section className="career-section">
          <h3>Teknik yetkinlikler</h3>
          {job.skillsIntro && <p className="career-note">{job.skillsIntro}</p>}
          <Skills skills={job.skills} />
        </section>
        <div className="career-section career-two">
          <section>
            <h3>Tercih sebepleri</h3>
            <List items={job.preferred} />
          </section>
          <section>
            <h3>Kayra'da seni neler bekliyor?</h3>
            <List items={job.offers} />
          </section>
        </div>
        <section className="career-section career-job-apply">
          <h3>Başvuru</h3>
          <p>{job.apply.text}</p>
          <p className="career-job-subject">E-posta konusu: {job.apply.subject}</p>
        </section>
      </details>
    </article>
  );
}

/** kayra.technology/kariyer: every open position on one page, each with its own e-mail application. */
export function CareerPage() {
  const { email } = jobs[0].apply;

  useEffect(() => {
    document.title = "Kariyer · Açık pozisyonlar · Kayra";
  }, []);

  return (
    <div className="career-page">
      <header className="site-header">
        <div className="shell site-header-inner">
          <a className="site-brand" href="/" aria-label="Kayra ana sayfa">
            <span className="kayra-identity">
              <img src={asset("brand/kayra-emblem.svg")} alt="" aria-hidden="true" width="31" height="37" />
              <span className="kayra-wordmark">KAYRA<span>TECHNOLOGY</span></span>
            </span>
          </a>
          <SectionTabs />
        </div>
      </header>

      <main className="shell">
        <section className="career-hero" aria-labelledby="careers-title">
          <p className="kicker"><span /> KARİYER</p>
          <h1 id="careers-title">Açık pozisyonlar</h1>
          <ul className="career-index">
            {jobs.map((job) => <li key={job.id}>{job.title}</li>)}
          </ul>
        </section>

        {jobs.map((job, index) => <Posting key={job.id} job={job} index={index} />)}

        <section className="career-apply" aria-labelledby="apply-title">
          <div>
            <p className="kicker"><span /> BAŞVURU</p>
            <h2 id="apply-title">Başvurunu bekliyoruz.</h2>
            <p>Başvurunu ilgili ilanın "Başvur" butonundan ya da doğrudan bu adrese gönderebilirsin.</p>
          </div>
          <div className="career-apply-actions">
            <ApplyMenu apply={{ email, subject: "Başvuru" }} label={email} align="end" />
            <span>{location}</span>
          </div>
        </section>
      </main>

      <footer className="career-footer shell">
        <span>© 2026 KAYRA TECHNOLOGY</span>
        <a href="/egitim">Eğitimler</a>
      </footer>
    </div>
  );
}

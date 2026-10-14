import { useEffect } from "react";
import { Mail } from "lucide-react";
import { asset } from "./asset";
import { jobs } from "./jobs";
import { sections } from "./sections";
import { applyHref, bullet, pad } from "./posting";

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

/** kayra.technology/kariyer: open position with the full posting and an e-mail application. */
export function CareerPage() {
  const [job] = jobs;

  useEffect(() => {
    document.title = `Kariyer · ${job.title} · Kayra`;
  }, [job.title]);

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
          <a className="button career-header-cta" href={applyHref(job.apply)}>Başvur <Mail size={15} /></a>
        </div>
      </header>

      <main className="shell">
        <section className="career-hero" aria-labelledby="job-title">
          <p className="kicker"><span /> KARİYER · AÇIK POZİSYON</p>
          <h1 id="job-title">{job.title}</h1>
          <p className="career-summary">{job.summary}</p>
          <dl className="career-meta">
            {job.meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <a className="button" href={applyHref(job.apply)}>Başvur <Mail size={15} /></a>
        </section>

        <section className="career-section" aria-labelledby="requirements-title">
          <p className="kicker"><span /> 01 / ARANAN NİTELİKLER</p>
          <h2 id="requirements-title">Aradığımız ekip arkadaşı</h2>
          <ul className="career-list">{job.requirements.map((item) => <li key={item}>{bullet(item)}</li>)}</ul>
        </section>

        <section className="career-section" aria-labelledby="skills-title">
          <p className="kicker"><span /> 02 / TEKNİK YETKİNLİKLER</p>
          <h2 id="skills-title">Teknik yetkinlikler</h2>
          <p className="career-note">{job.skillsIntro}</p>
          <div className="career-skill-grid">
            {job.skills.map(([group, items], index) => (
              <article key={group} className="career-skill">
                <span className="career-skill-index">{pad(index + 1)}</span>
                <h3>{group}</h3>
                <ul className="career-list">{items.map((item) => <li key={item}>{bullet(item)}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="career-section career-two" aria-label="Tercih sebepleri ve sunduklarımız">
          <div>
            <p className="kicker"><span /> 03 / TERCİH SEBEPLERİ</p>
            <h2>Tercih sebepleri</h2>
            <ul className="career-list">{job.preferred.map((item) => <li key={item}>{bullet(item)}</li>)}</ul>
          </div>
          <div>
            <p className="kicker"><span /> 04 / KAYRA'DA</p>
            <h2>Kayra'da seni neler bekliyor?</h2>
            <ul className="career-list">{job.offers.map((item) => <li key={item}>{bullet(item)}</li>)}</ul>
          </div>
        </section>

        <section className="career-apply" aria-labelledby="apply-title">
          <div>
            <p className="kicker"><span /> BAŞVURU</p>
            <h2 id="apply-title">Başvurunu bekliyoruz.</h2>
            <p>{job.apply.text}</p>
          </div>
          <div className="career-apply-actions">
            <a className="button" href={applyHref(job.apply)}>{job.apply.email} <Mail size={15} /></a>
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

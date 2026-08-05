import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  CloudCog,
  ExternalLink,
  Network,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import { Link } from '../router'
import { knowledgeDomains, knowledgeStats, productionReadiness, type KnowledgeDomain } from '../data/knowledge'
import { CodeBlock } from './CodeBlock'

function CategoryIcon({ category }: { category: KnowledgeDomain['category'] }) {
  if (category === 'Container') return <Boxes size={22} />
  if (category === 'Docker') return <Terminal size={22} />
  if (category === 'Kubernetes') return <CloudCog size={22} />
  return <ShieldCheck size={22} />
}

export function KnowledgePage() {
  const scrollToDomain = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="knowledge-page section-wrap">
      <header className="knowledge-hero">
        <div className="knowledge-hero-copy">
          <span className="mini-label">KNOWLEDGE ATLAS</span>
          <h1>把指令背後的系統，<br />連成一張完整地圖。</h1>
          <p>
            課程帶你依序完成實作；這裡補上跨章節的架構、選型與維運知識。遇到陌生名詞時先定位它在哪一層，
            再回到對應課程驗證。
          </p>
          <Link className="button primary" to="/learn/ready">從課程開始 <ArrowRight size={17} /></Link>
        </div>
        <div className="knowledge-stats" aria-label="知識庫內容統計">
          <div><strong>{knowledgeStats.domains}</strong><span>主題領域</span></div>
          <div><strong>{knowledgeStats.concepts}</strong><span>核心觀念</span></div>
          <div><strong>{knowledgeStats.decisions}</strong><span>選型判斷</span></div>
          <div><strong>v1.36</strong><span>Kubernetes 基準</span></div>
        </div>
      </header>

      <section className="knowledge-map" aria-labelledby="knowledge-map-title">
        <div className="knowledge-section-heading">
          <div><span className="mini-label">SYSTEM MAP</span><h2 id="knowledge-map-title">從 Process 一路走到平台維運</h2></div>
          <p>依學習順序排列；按下主題可直接移到完整說明。</p>
        </div>
        <div className="knowledge-map-grid">
          {knowledgeDomains.map((domain) => (
            <button type="button" key={domain.id} onClick={() => scrollToDomain(domain.id)}>
              <span className={`knowledge-map-icon ${domain.category.toLowerCase()}`}><CategoryIcon category={domain.category} /></span>
              <small>{domain.number} · {domain.category}</small>
              <strong>{domain.title}</strong>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
      </section>

      <div className="knowledge-domains">
        {knowledgeDomains.map((domain) => (
          <section className="knowledge-domain" id={domain.id} key={domain.id}>
            <header className="knowledge-domain-header">
              <span className={`knowledge-domain-icon ${domain.category.toLowerCase()}`}><CategoryIcon category={domain.category} /></span>
              <div>
                <small>{domain.number} · {domain.category}</small>
                <h2>{domain.title}</h2>
                <p>{domain.summary}</p>
              </div>
            </header>

            <div className="mental-model">
              <BookOpen size={20} />
              <div><small>MENTAL MODEL</small><strong>{domain.mentalModel}</strong></div>
            </div>

            <div className="knowledge-point-grid">
              {domain.points.map((point, index) => (
                <article key={point.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </article>
              ))}
            </div>

            <div className="decision-panel">
              <header><CheckCircle2 size={20} /><div><small>DECISION GUIDE</small><h3>看到這個情境，先做什麼選擇？</h3></div></header>
              <div className="decision-table">
                {domain.decisions.map((decision) => (
                  <div className="decision-row" key={decision.scenario}>
                    <strong>{decision.scenario}</strong>
                    <span>{decision.choose}</span>
                    <p>{decision.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <CodeBlock block={domain.command} />

            <footer className="knowledge-domain-footer">
              <Link to={domain.lessonPath}>{domain.lessonLabel}<ArrowRight size={15} /></Link>
              <a href={domain.source.href} target="_blank" rel="noreferrer">{domain.source.label}<ExternalLink size={13} /></a>
            </footer>
          </section>
        ))}
      </div>

      <section className="readiness-section" aria-labelledby="readiness-title">
        <div className="knowledge-section-heading">
          <div><span className="mini-label">PRODUCTION READINESS</span><h2 id="readiness-title">上線前，用證據回答八個問題</h2></div>
          <p>「已部署」不等於「可營運」。逐項留下可重複驗證的輸出、文件或演練紀錄。</p>
        </div>
        <div className="readiness-grid">
          {productionReadiness.map((gate, index) => (
            <article key={gate.area}>
              <header><span>{String(index + 1).padStart(2, '0')}</span><strong>{gate.area}</strong><ShieldCheck size={19} /></header>
              <h3>{gate.question}</h3>
              <p>{gate.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-next-step">
        <Network size={29} />
        <div><span className="mini-label">LEARN BY VERIFYING</span><h2>知識要回到證據，才會變成能力。</h2><p>選一個還不熟的領域，回到對應課程執行指令、觀察輸出，再刻意製造一次可復原的錯誤。</p></div>
        <Link className="button primary" to="/learn/ready">前往學習路徑 <ArrowRight size={17} /></Link>
      </section>
    </div>
  )
}

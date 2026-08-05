import { ArrowRight, CheckCircle2, Lightbulb, ShieldCheck, Terminal, Wrench } from 'lucide-react'
import type { FoundationGuide } from '../data/foundations'
import { FoundationDiagram } from './FoundationDiagram'

export function FoundationDeepDive({ guide }: { guide: FoundationGuide }) {
  return (
    <section className="lesson-section foundation-deep-dive">
      <div className="section-index">01</div>
      <div className="lesson-section-body">
        <span className="mini-label">{guide.label}</span>
        <h2>{guide.title}</h2>
        <p className="section-lead foundation-intro">{guide.intro}</p>

        <div className="foundation-definition">
          <span><Lightbulb size={22} /></span>
          <div>
            <small>一句話定義</small>
            <h3>{guide.definition.title}</h3>
            <p>{guide.definition.body}</p>
            <strong>{guide.definition.keyPoint}</strong>
          </div>
        </div>

        <FoundationDiagram type={guide.diagram} />

        <div className="foundation-subheading">
          <span>WHY IT MATTERS</span>
          <h3>如果沒有它，會遇到什麼問題？</h3>
        </div>
        <div className="reason-grid">
          {guide.reasons.map((reason, index) => (
            <article key={reason.problem}>
              <span className="reason-number">0{index + 1}</span>
              <h4>{reason.problem}</h4>
              <p>{reason.symptom}</p>
              <div><ArrowRight size={15} /><strong>{reason.answer}</strong></div>
            </article>
          ))}
        </div>

        <div className="capability-contrast">
          <section className="solves">
            <header><CheckCircle2 size={20} /><div><small>WHAT IT SOLVES</small><h3>它能解決</h3></div></header>
            {guide.solves.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.body}</p></div>)}
          </section>
          <section className="limits">
            <header><ShieldCheck size={20} /><div><small>KNOW THE LIMITS</small><h3>它不會自動解決</h3></div></header>
            {guide.limits.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.body}</p></div>)}
          </section>
        </div>

        <div className="foundation-subheading command-heading">
          <span>ESSENTIAL COMMANDS</span>
          <h3>重要指令不是背誦，而是回答一個問題</h3>
          <p>每次輸入指令前，先說出你想觀察或改變的狀態。</p>
        </div>
        <div className="essential-commands">
          <div className="command-table-head"><span>指令</span><span>它做什麼</span><span>何時使用</span></div>
          {guide.commands.map((item) => (
            <div className="command-context-row" key={item.command}>
              <code>{item.command}</code>
              <p>{item.meaning}</p>
              <small>{item.useWhen}</small>
            </div>
          ))}
        </div>

        <div className="practice-blueprint">
          <header><span><Terminal size={21} /></span><div><small>PRACTICE BLUEPRINT</small><h3>{guide.practice.title}</h3></div></header>
          <p>{guide.practice.goal}</p>
          <div className="practice-path">
            {guide.practice.steps.map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong>{index < guide.practice.steps.length - 1 && <ArrowRight size={17} />}</div>)}
          </div>
          <div className="observe-callout"><Wrench size={17} /><p><strong>觀察重點：</strong>{guide.practice.observe}</p></div>
        </div>
      </div>
    </section>
  )
}

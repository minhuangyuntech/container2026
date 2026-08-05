import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  CloudCog,
  Code2,
  Container,
  ExternalLink,
  GraduationCap,
  Layers3,
  Lightbulb,
  Menu,
  Moon,
  Network,
  Play,
  RotateCcw,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Trophy,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from './router'
import { CodeBlock } from './components/CodeBlock'
import { EnvironmentSetupGuide } from './components/EnvironmentSetupGuide'
import { FoundationDeepDive } from './components/FoundationDeepDive'
import { SearchDialog } from './components/SearchDialog'
import {
  dockerLessons,
  getLesson,
  getNextLesson,
  getPreviousLesson,
  kubernetesLessons,
  lessons,
  type Lesson,
  type Quiz,
} from './data/curriculum'
import { getFoundationGuide } from './data/foundations'
import { cheatGroups, glossary, troubleshooting } from './data/reference'
import { useProgress } from './hooks/useProgress'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])
  return null
}

function App() {
  const progress = useProgress(lessons.length)
  return (
    <>
      <ScrollToTop />
      <SiteLayout completed={progress.completed} percentage={progress.percentage}>
        <Routes>
          <Route path="/" element={<HomePage completed={progress.completed} percentage={progress.percentage} />} />
          <Route path="/learn" element={<Navigate to="/learn/ready" replace />} />
          <Route path="/learn/:lessonId" element={<LessonPage completed={progress.completed} onToggle={progress.toggleCompleted} />} />
          <Route path="/cheatsheet" element={<CheatSheetPage />} />
          <Route path="/troubleshooting" element={<TroubleshootingPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SiteLayout>
    </>
  )
}

type LayoutProps = {
  children: React.ReactNode
  completed: string[]
  percentage: number
}

function SiteLayout({ children, completed, percentage }: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    window.localStorage.getItem('container-lab-theme') === 'light' ? 'light' : 'dark',
  )
  const location = useLocation()

  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('container-lab-theme', theme)
  }, [theme])

  useEffect(() => setMobileOpen(false), [location.pathname])

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', openSearch)
    return () => window.removeEventListener('keydown', openSearch)
  }, [])

  const navItems = [
    { to: '/', label: '首頁', end: true },
    { to: '/learn/ready', label: '學習路徑' },
    { to: '/cheatsheet', label: '速查表' },
    { to: '/troubleshooting', label: '疑難排解' },
  ]

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Container Lab 首頁">
          <span className="brand-mark"><Boxes size={22} /></span>
          <span>Container <b>Lab</b></span>
        </Link>
        <nav className="desktop-nav" aria-label="主要導覽">
          {navItems.map((item) => (
            <NavLink key={item.to} end={item.end} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {completed.length > 0 && (
            <div className="header-progress" title={`已完成 ${completed.length} / ${lessons.length} 課`}>
              <span><i style={{ width: `${percentage}%` }} /></span>
              <small>{percentage}%</small>
            </div>
          )}
          <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
            <Search size={17} /><span>搜尋</span><kbd>/</kbd>
          </button>
          <button type="button" className="icon-button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? '切換淺色模式' : '切換深色模式'}>
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button type="button" className="icon-button menu-button" onClick={() => setMobileOpen((current) => !current)} aria-label="開啟導覽選單" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav" aria-label="行動版導覽">
            {navItems.map((item) => <NavLink key={item.to} end={item.end} to={item.to}>{item.label}<ChevronRight size={16} /></NavLink>)}
            <NavLink to="/glossary">名詞表<ChevronRight size={16} /></NavLink>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <Link to="/" className="brand footer-brand"><span className="brand-mark"><Boxes size={19} /></span><span>Container <b>Lab</b></span></Link>
          <p>把複雜的容器概念，變成可以親手驗證的技能。</p>
        </div>
        <div className="footer-links">
          <Link to="/learn/ready">開始學習</Link>
          <Link to="/cheatsheet">指令速查</Link>
          <Link to="/glossary">名詞表</Link>
          <a href="https://docs.docker.com/" target="_blank" rel="noreferrer">Docker Docs <ExternalLink size={13} /></a>
          <a href="https://kubernetes.io/docs/" target="_blank" rel="noreferrer">Kubernetes Docs <ExternalLink size={13} /></a>
        </div>
        <p className="footer-note">繁體中文 · 實作導向 · 開放原始碼</p>
      </footer>
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  )
}

type HomeProps = { completed: string[]; percentage: number }

function HomePage({ completed, percentage }: HomeProps) {
  const nextLesson = lessons.find((lesson) => !completed.includes(lesson.id)) ?? lessons[0]
  return (
    <>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> 繁體中文 · 實作導向</div>
          <h1>從 Docker 基礎，<br />走進<span>Kubernetes 實戰</span>。</h1>
          <p className="hero-lead">從 Image、Container、Network、Volume 與 Compose 開始，進一步掌握 Pod、Deployment、Service、發布與除錯。</p>
          <div className="hero-actions">
            <Link className="button primary" to={`/learn/${nextLesson.id}`}><Play size={17} fill="currentColor" />{completed.length ? '繼續學習' : '開始第一課'}</Link>
            <a className="button ghost" href="#roadmap">查看學習地圖 <ArrowRight size={17} /></a>
          </div>
          <div className="hero-proof">
            <span><CheckCircle2 size={16} /> 11 個循序章節</span>
            <span><CheckCircle2 size={16} /> 每課可執行 Lab</span>
            <span><CheckCircle2 size={16} /> 約 8–9 小時完成</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="從 Docker Image 到 Kubernetes Deployment 的終端機示意">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="terminal-card">
            <div className="terminal-bar"><span /><span /><span /><small>container-lab — zsh</small></div>
            <div className="terminal-body">
              <p><i>$</i> docker build -t app:1.0 .</p>
              <p className="muted">[+] Building 8.4s ··· done</p>
              <p><i>$</i> kubectl apply -f k8s/</p>
              <p className="success">deployment.apps/app created</p>
              <p className="success">service/app created</p>
              <p><i>$</i> kubectl get pods</p>
              <p><b>NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;STATUS</b></p>
              <p>app-7c9f&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;<em>Running</em></p>
              <p>app-9d2a&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;<em>Running</em></p>
              <span className="cursor" />
            </div>
          </div>
          <div className="floating-badge badge-docker"><Container size={19} /><span><small>IMAGE</small>container-lab:1.0</span></div>
          <div className="floating-badge badge-k8s"><CloudCog size={20} /><span><small>DEPLOYMENT</small>2 / 2 Ready</span></div>
        </div>
      </section>

      <section className="metrics-strip">
        <div className="section-wrap metrics-inner">
          <div><strong>11</strong><span>個章節<br />從零到部署</span></div>
          <div><strong>40+</strong><span>段指令<br />附使用情境</span></div>
          <div><strong>1</strong><span>個專題<br />貫穿整門課</span></div>
          <div><strong>0</strong><span>後端需求<br />進度留在裝置</span></div>
        </div>
      </section>

      <section className="section-wrap foundation-overview">
        <div className="foundation-overview-copy">
          <span className="mini-label">FOUNDATION FIRST</span>
          <h2>先回答三個「為什麼」，再開始背指令</h2>
          <p>工具會更新，指令也會增加；真正能帶走的是問題意識：單一服務如何一致交付、多個服務如何合作、大量服務如何持續維持可用。</p>
        </div>
        <div className="orchestration-art">
          <img src={`${import.meta.env.BASE_URL}orchestration-journey.png`} alt="從獨立容器、多服務組合到叢集編排的視覺化過程" />
          <div className="art-stage-labels" aria-hidden="true">
            <span>01 · CONTAINER</span><span>02 · COMPOSE</span><span>03 · KUBERNETES</span>
          </div>
        </div>
        <div className="foundation-question-grid">
          <Link to="/learn/container-basics"><span><Container size={21} /></span><div><small>WHY CONTAINERS?</small><h3>為什麼需要容器？</h3><p>解決環境漂移、依賴衝突與不可重現的部署。</p></div><ArrowRight size={18} /></Link>
          <Link to="/learn/compose"><span><Network size={21} /></span><div><small>WHY COMPOSE?</small><h3>為什麼需要 Compose？</h3><p>用一份 YAML 重現多服務、網路、設定與資料。</p></div><ArrowRight size={18} /></Link>
          <Link to="/learn/k8s-map"><span><CloudCog size={22} /></span><div><small>WHY KUBERNETES?</small><h3>為什麼需要 Kubernetes？</h3><p>跨節點排程、自我修復、擴展與漸進式發布。</p></div><ArrowRight size={18} /></Link>
        </div>
      </section>

      {completed.length > 0 && (
        <section className="section-wrap resume-section">
          <div className="resume-card">
            <div className="resume-copy">
              <span className="mini-label">YOUR PROGRESS</span>
              <h2>已經跨出第一步，繼續往前。</h2>
              <p>完成 {completed.length} / {lessons.length} 課。下一站：{nextLesson.title}</p>
            </div>
            <div className="resume-progress"><strong>{percentage}%</strong><div><span style={{ width: `${percentage}%` }} /></div></div>
            <Link className="button primary" to={`/learn/${nextLesson.id}`}>繼續學習 <ArrowRight size={17} /></Link>
          </div>
        </section>
      )}

      <section className="section-wrap value-section">
        <div className="section-heading centered">
          <span className="mini-label">LEARN BY SHIPPING</span>
          <h2>每個觀念，都有一次親手驗證</h2>
          <p>用一致的服務部署情境走完整條路徑，少一點零碎範例，多一點可累積的理解。</p>
        </div>
        <div className="value-grid">
          <article><span className="feature-icon cyan"><Terminal size={22} /></span><h3>先做，再理解</h3><p>每課以可執行的 Lab 收尾，包含指令、預期結果與完成檢查。</p></article>
          <article><span className="feature-icon violet"><Layers3 size={22} /></span><h3>一條清楚主線</h3><p>從單一 Container 到多服務，再銜接 Kubernetes，不在工具間迷路。</p></article>
          <article><span className="feature-icon green"><Wrench size={22} /></span><h3>學會讀證據</h3><p>不只展示順利路徑，也練習從 logs、events 與狀態判斷問題。</p></article>
        </div>
      </section>

      <section id="roadmap" className="section-wrap roadmap-section">
        <div className="section-heading roadmap-heading">
          <div><span className="mini-label">THE ROADMAP</span><h2>一條路徑，串起兩個世界</h2></div>
          <p>從第 0 課建立環境，完成 Docker 觀念後自然銜接 Kubernetes。每一課約 20–60 分鐘。</p>
        </div>
        <div className="roadmap-grid">
          <RoadmapColumn title="Docker 基礎與實戰" kicker="PART 01" icon={<Container size={24} />} lessons={dockerLessons} completed={completed} accent="docker" />
          <RoadmapColumn title="Kubernetes 編排" kicker="PART 02" icon={<CloudCog size={25} />} lessons={kubernetesLessons} completed={completed} accent="kubernetes" />
        </div>
        <div className="prep-link"><span>00</span><div><small>開始之前</small><strong>準備你的容器實驗室</strong></div><Link to="/learn/ready">檢查環境 <ArrowRight size={16} /></Link></div>
      </section>

      <section className="section-wrap capstone-section">
        <div className="capstone-card">
          <div className="capstone-glow" />
          <div className="trophy-ring"><Trophy size={37} /></div>
          <div className="capstone-copy">
            <span className="mini-label">FINAL CAPSTONE</span>
            <h2>最後，完成一套可維運的容器服務。</h2>
            <p>建立 production Image、Deployment、Service、ConfigMap 與 health probes，實際完成擴展、更新、診斷與 rollback。</p>
          </div>
          <Link className="button light" to="/learn/debug-capstone">查看專題規格 <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  )
}

function RoadmapColumn({ title, kicker, icon, lessons: phaseLessons, completed, accent }: { title: string; kicker: string; icon: React.ReactNode; lessons: Lesson[]; completed: string[]; accent: string }) {
  return (
    <article className={`roadmap-column ${accent}`}>
      <header><span className="roadmap-icon">{icon}</span><div><small>{kicker}</small><h3>{title}</h3></div><b>{phaseLessons.length} LESSONS</b></header>
      <div className="lesson-list">
        {phaseLessons.map((lesson) => {
          const done = completed.includes(lesson.id)
          return (
            <Link to={`/learn/${lesson.id}`} key={lesson.id} className="lesson-row">
              <span className={`lesson-status ${done ? 'done' : ''}`}>{done ? <Check size={15} /> : String(lesson.number).padStart(2, '0')}</span>
              <span><strong>{lesson.shortTitle}</strong><small>{lesson.duration} · {lesson.level}</small></span>
              <ChevronRight size={17} />
            </Link>
          )
        })}
      </div>
    </article>
  )
}

type LessonPageProps = { completed: string[]; onToggle: (id: string) => void }

function LessonPage({ completed, onToggle }: LessonPageProps) {
  const { lessonId } = useParams()
  const lesson = getLesson(lessonId)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!lesson) return <NotFoundPage />

  const previous = getPreviousLesson(lesson.id)
  const next = getNextLesson(lesson.id)
  const done = completed.includes(lesson.id)
  const foundationGuide = getFoundationGuide(lesson.id)
  const hasExtendedGuide = Boolean(foundationGuide) || lesson.id === 'ready'

  return (
    <div className="learning-shell">
      <aside className={`course-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div><small>DOCKER × KUBERNETES</small><strong>課程進度</strong></div>
          <button type="button" className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="關閉課程目錄"><X size={18} /></button>
        </div>
        <div className="sidebar-progress"><span style={{ width: `${Math.round(completed.length / lessons.length * 100)}%` }} /></div>
        <nav aria-label="課程章節">
          {['準備', 'Docker', 'Kubernetes'].map((phase) => (
            <div className="sidebar-group" key={phase}>
              <small>{phase === '準備' ? 'START HERE' : phase.toUpperCase()}</small>
              {lessons.filter((item) => item.phase === phase).map((item) => {
                const active = item.id === lesson.id
                const itemDone = completed.includes(item.id)
                return (
                  <Link key={item.id} to={`/learn/${item.id}`} className={`${active ? 'active' : ''} ${itemDone ? 'done' : ''}`}>
                    <span>{itemDone ? <Check size={14} /> : String(item.number).padStart(2, '0')}</span>
                    <b>{item.shortTitle}</b>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <Link className="sidebar-reference" to="/cheatsheet"><Terminal size={17} />指令速查表<ArrowRight size={15} /></Link>
      </aside>
      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="關閉課程目錄" />}

      <article className="lesson-page">
        <button type="button" className="mobile-course-trigger" onClick={() => setSidebarOpen(true)}><Menu size={17} /> 課程目錄</button>
        <div className="lesson-breadcrumb"><Link to="/">首頁</Link><ChevronRight size={14} /><span>{lesson.phase}</span><ChevronRight size={14} /><span>第 {lesson.number} 課</span></div>
        <header className="lesson-hero">
          <div className="lesson-kicker"><span>LESSON {String(lesson.number).padStart(2, '0')}</span><i />{lesson.phase}</div>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
          <div className="lesson-meta"><span><Clock3 size={16} />{lesson.duration}</span><span><GraduationCap size={17} />{lesson.level}</span><span><Code2 size={16} />Hands-on Lab</span></div>
        </header>

        <section className="objectives-card">
          <div className="objectives-title"><span><Trophy size={20} /></span><div><small>LEARNING OBJECTIVES</small><h2>完成這課，你將能夠</h2></div></div>
          <ul>{lesson.objectives.map((objective) => <li key={objective}><CheckCircle2 size={18} />{objective}</li>)}</ul>
        </section>

        {lesson.id === 'ready' && <EnvironmentSetupGuide />}
        {foundationGuide && <FoundationDeepDive guide={foundationGuide} />}

        <section className="lesson-section">
          <div className="section-index">{hasExtendedGuide ? '02' : '01'}</div>
          <div className="lesson-section-body">
            <span className="mini-label">CORE CONCEPT</span>
            <h2>先建立正確的心智模型</h2>
            <div className="concepts-grid">
              {lesson.concepts.map((concept) => <div className="concept-card" key={concept.title}><Lightbulb size={20} /><h3>{concept.title}</h3><p>{concept.body}</p></div>)}
            </div>
            <div className="concept-flow" aria-label={lesson.flow.join(' 到 ')}>
              {lesson.flow.map((node, index) => <div key={node} className="flow-piece"><span>{index + 1}</span><strong>{node}</strong>{index < lesson.flow.length - 1 && <ArrowRight size={20} />}</div>)}
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <div className="section-index">{hasExtendedGuide ? '03' : '02'}</div>
          <div className="lesson-section-body">
            <span className="mini-label">HANDS-ON LAB</span>
            <h2>{lesson.lab.title}</h2>
            <p className="section-lead">{lesson.lab.intro}</p>
            <ol className="lab-steps">{lesson.lab.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
            <div className="code-stack">{lesson.lab.commands.map((block) => <CodeBlock key={block.label} block={block} />)}</div>
            {lesson.note && <div className="note-callout"><Lightbulb size={20} /><div><strong>實作提醒</strong><p>{lesson.note}</p></div></div>}
            <div className="success-check">
              <div><CheckCircle2 size={23} /><strong>完成檢查</strong></div>
              <ul>{lesson.lab.success.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <div className="section-index">{hasExtendedGuide ? '04' : '03'}</div>
          <div className="lesson-section-body">
            <span className="mini-label">DEBUG MINDSET</span>
            <h2>常見卡關點</h2>
            <div className="pitfall-list">{lesson.pitfalls.map((item) => <div key={item.title}><span><Wrench size={18} /></span><div><h3>{item.title}</h3><p>{item.fix}</p></div></div>)}</div>
          </div>
        </section>

        <QuizCard quiz={lesson.quiz} />

        <section className={`complete-card ${done ? 'completed' : ''}`}>
          <span className="complete-icon">{done ? <CheckCircle2 size={31} /> : <Circle size={31} />}</span>
          <div><small>{done ? 'LESSON COMPLETE' : 'READY TO MOVE ON?'}</small><h2>{done ? '這一課完成了！' : '完成實作與測驗了嗎？'}</h2><p>{done ? '進度已保存在這台裝置，下次回來可以接著學。' : '確認結果符合完成檢查，再把這課標記為完成。'}</p></div>
          <button type="button" className={`button ${done ? 'ghost' : 'primary'}`} onClick={() => onToggle(lesson.id)}>{done ? <><RotateCcw size={17} />取消完成</> : <><Check size={18} />標記完成</>}</button>
        </section>

        <nav className="lesson-pagination" aria-label="課程前後導覽">
          {previous ? <Link to={`/learn/${previous.id}`}><ArrowLeft size={17} /><span><small>上一課</small><strong>{previous.shortTitle}</strong></span></Link> : <span />}
          {next ? <Link to={`/learn/${next.id}`} className="next"><span><small>下一課</small><strong>{next.shortTitle}</strong></span><ArrowRight size={17} /></Link> : <Link to="/" className="next"><span><small>完成</small><strong>回到首頁</strong></span><Trophy size={17} /></Link>}
        </nav>
      </article>
    </div>
  )
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  const [choice, setChoice] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const correct = choice === quiz.answer

  const reset = () => { setChoice(null); setChecked(false) }

  return (
    <section className="quiz-card">
      <div className="quiz-top"><span><Zap size={22} /></span><div><small>QUICK CHECK</small><h2>30 秒測驗</h2></div></div>
      <p className="quiz-question">{quiz.question}</p>
      <div className="quiz-options">
        {quiz.options.map((option, index) => {
          const state = checked ? index === quiz.answer ? 'correct' : choice === index ? 'incorrect' : '' : choice === index ? 'selected' : ''
          return <button type="button" className={state} key={option} onClick={() => !checked && setChoice(index)} disabled={checked}><span>{String.fromCharCode(65 + index)}</span>{option}{checked && index === quiz.answer && <Check size={17} />}</button>
        })}
      </div>
      {!checked ? <button type="button" className="button primary quiz-submit" disabled={choice === null} onClick={() => setChecked(true)}>確認答案</button> : (
        <div className={`quiz-feedback ${correct ? 'correct' : 'incorrect'}`}>
          <span>{correct ? <CheckCircle2 size={23} /> : <RotateCcw size={22} />}</span>
          <div><strong>{correct ? '答對了！' : '再看一次核心概念'}</strong><p>{quiz.explanation}</p></div>
          {!correct && <button type="button" onClick={reset}>重試</button>}
        </div>
      )}
    </section>
  )
}

function PageHero({ kicker, title, description, icon }: { kicker: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <header className="reference-hero">
      <span className="reference-icon">{icon}</span>
      <div><span className="mini-label">{kicker}</span><h1>{title}</h1><p>{description}</p></div>
    </header>
  )
}

function CheatSheetPage() {
  const [filter, setFilter] = useState<'全部' | 'Docker' | 'Kubernetes'>('全部')
  const groups = filter === '全部' ? cheatGroups : cheatGroups.filter((group) => filter === 'Docker' ? group.accent === 'docker' : group.accent === 'kubernetes')
  return (
    <div className="reference-page section-wrap">
      <PageHero kicker="QUICK REFERENCE" title="指令速查表" description="忘記語法很正常。先找到正確的觀察與操作指令，再理解輸出告訴你的事。" icon={<Terminal size={31} />} />
      <div className="filter-tabs" role="group" aria-label="篩選指令">{(['全部', 'Docker', 'Kubernetes'] as const).map((item) => <button type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
      <div className="cheat-grid">
        {groups.map((group) => <section className={`cheat-group ${group.accent}`} key={group.title}><header><span>{group.accent === 'docker' ? <Container size={20} /> : <CloudCog size={20} />}</span><h2>{group.title}</h2></header>{group.items.map((item) => <div className="cheat-row" key={item.command}><code>{item.command}</code><p>{item.description}</p></div>)}</section>)}
      </div>
      <div className="reference-note"><ShieldCheck size={20} /><p><strong>先確認 context，再執行變更。</strong>涉及刪除、清理與正式環境時，不要直接複製貼上；先理解目標資源與影響範圍。</p></div>
    </div>
  )
}

function TroubleshootingPage() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => troubleshooting.filter((item) => [item.status, item.area, item.symptom, item.fix].join(' ').toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <div className="reference-page section-wrap">
      <PageHero kicker="TROUBLESHOOTING" title="不要猜，照證據除錯" description="從狀態、事件到 log，依固定順序縮小問題。下面整理最常見的容器與叢集症狀。" icon={<Wrench size={31} />} />
      <label className="reference-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋錯誤狀態或症狀…" /></label>
      <div className="trouble-list">
        {results.map((item) => <details key={item.status} className="trouble-card"><summary><span className={item.area === 'Docker' ? 'docker' : 'kubernetes'}>{item.area}</span><strong>{item.status}</strong><p>{item.symptom}</p><ChevronRight size={19} /></summary><div className="trouble-body"><div><small>先檢查</small><ol>{item.checks.map((check) => <li key={check}>{check}</li>)}</ol></div><div><small>處理方向</small><p>{item.fix}</p></div></div></details>)}
      </div>
      {!results.length && <div className="empty-state"><Search size={25} /><h2>找不到符合的症狀</h2><p>試試 Docker、port、Pending 或 Service。</p></div>}
    </div>
  )
}

function GlossaryPage() {
  const [query, setQuery] = useState('')
  const results = glossary.filter((item) => [item.term, item.zh, item.definition].join(' ').toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="reference-page section-wrap">
      <PageHero kicker="GLOSSARY" title="容器名詞表" description="保留英文關鍵字，也用繁體中文說清楚概念。搜尋時中英文都可以。" icon={<BookOpen size={31} />} />
      <label className="reference-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋 Image、Pod、部署…" /></label>
      <div className="glossary-grid">{results.map((item) => <article key={item.term}><span>{item.term.slice(0, 2).toUpperCase()}</span><div><h2>{item.term}</h2><small>{item.zh}</small><p>{item.definition}</p></div></article>)}</div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <section className="not-found section-wrap">
      <span>404</span><Boxes size={42} /><h1>這個 Container 裡沒有頁面</h1><p>路徑可能已經改變，回到首頁或從第一課重新開始。</p><Link className="button primary" to="/">回到首頁 <ArrowRight size={17} /></Link>
    </section>
  )
}

export default App

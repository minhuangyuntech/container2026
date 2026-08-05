import { ArrowRight, BookOpen, Search, Wrench, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '../router'
import { lessons } from '../data/curriculum'
import { glossary, troubleshooting } from '../data/reference'

type SearchDialogProps = {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    setQuery('')
    window.setTimeout(() => inputRef.current?.focus(), 30)
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose, open])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return lessons.slice(0, 5).map((lesson) => ({
      type: '課程',
      icon: BookOpen,
      title: lesson.title,
      detail: `${lesson.phase} · ${lesson.duration}`,
      path: `/learn/${lesson.id}`,
    }))

    const lessonResults = lessons
      .filter((lesson) => [lesson.title, lesson.shortTitle, lesson.summary, ...lesson.objectives].join(' ').toLowerCase().includes(normalized))
      .map((lesson) => ({ type: '課程', icon: BookOpen, title: lesson.title, detail: lesson.summary, path: `/learn/${lesson.id}` }))
    const termResults = glossary
      .filter((item) => [item.term, item.zh, item.definition].join(' ').toLowerCase().includes(normalized))
      .map((item) => ({ type: '名詞', icon: Search, title: `${item.term} · ${item.zh}`, detail: item.definition, path: '/glossary' }))
    const issueResults = troubleshooting
      .filter((item) => [item.status, item.symptom, item.area].join(' ').toLowerCase().includes(normalized))
      .map((item) => ({ type: '除錯', icon: Wrench, title: item.status, detail: item.symptom, path: '/troubleshooting' }))
    return [...lessonResults, ...termResults, ...issueResults].slice(0, 8)
  }, [query])

  if (!open) return null

  const choose = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="search-dialog" role="dialog" aria-modal="true" aria-label="搜尋課程內容">
        <div className="search-field">
          <Search size={20} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜尋 Image、Deployment、CrashLoopBackOff…"
            aria-label="搜尋關鍵字"
          />
          <button type="button" className="icon-button" onClick={onClose} aria-label="關閉搜尋"><X size={19} /></button>
        </div>
        <div className="search-results">
          <p className="search-hint">{query ? `找到 ${results.length} 筆結果` : '建議從這裡開始'}</p>
          {results.length ? results.map((result, index) => {
            const Icon = result.icon
            return (
              <button type="button" className="search-result" key={`${result.title}-${index}`} onClick={() => choose(result.path)}>
                <span className="search-result-icon"><Icon size={18} /></span>
                <span>
                  <small>{result.type}</small>
                  <strong>{result.title}</strong>
                  <span>{result.detail}</span>
                </span>
                <ArrowRight size={17} />
              </button>
            )
          }) : <div className="empty-search">換個關鍵字試試，例如「Pod」或「port」。</div>}
        </div>
      </section>
    </div>
  )
}

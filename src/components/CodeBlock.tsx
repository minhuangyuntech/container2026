import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import type { CommandBlock } from '../data/curriculum'

export function CodeBlock({ block }: { block: CommandBlock }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(block.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{block.label}</span>
        <div className="code-toolbar-meta">
          <span className="code-language">{block.language}</span>
          <button className="copy-button" type="button" onClick={copy} aria-label={`複製 ${block.label}`}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? '已複製' : '複製'}
          </button>
        </div>
      </div>
      <pre><code>{block.code}</code></pre>
    </div>
  )
}

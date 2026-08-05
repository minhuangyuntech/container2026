import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { HashRouter } from './router'

window.scrollTo = vi.fn(() => 42) as unknown as typeof window.scrollTo
afterEach(cleanup)

function renderApp(path = '/') {
  window.localStorage.clear()
  window.location.hash = `#${path}`
  return render(<HashRouter><App /></HashRouter>)
}

describe('Container Lab', () => {
  it('renders the course landing page and roadmap', () => {
    const view = renderApp()
    expect(screen.getByRole('heading', { name: /從 Docker 基礎/ })).toBeInTheDocument()
    expect(screen.getByText('Docker 基礎與實戰')).toBeInTheDocument()
    expect(screen.getByText('Kubernetes 編排')).toBeInTheDocument()
    expect(() => view.unmount()).not.toThrow()
  })

  it('opens course search and shows lesson results', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: /搜尋/ }))
    const input = screen.getByRole('textbox', { name: '搜尋關鍵字' })
    await user.type(input, 'Deployment')
    expect(screen.getByText('Deployment 管理你的 Pod')).toBeInTheDocument()
  })

  it('explains container foundations with a diagram and contextual commands', () => {
    renderApp('/learn/container-basics')
    expect(screen.getByRole('heading', { name: '什麼是容器？為什麼現代交付需要它？' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /傳統安裝與容器化執行模型比較/ })).toBeInTheDocument()
    expect(screen.getByText('docker inspect web')).toBeInTheDocument()
  })

  it('explains environment requirements, implementations, and the course version baseline', () => {
    renderApp('/learn/ready')
    expect(screen.getByRole('heading', { name: '先決定版本，再選擇 Kubernetes 實作' })).toBeInTheDocument()
    expect(screen.getByText('Kubernetes v1.36')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '七種常見實作，先選最符合學習目的的' })).toBeInTheDocument()
    expect(screen.getByText('Docker Desktop Kubernetes')).toBeInTheDocument()
    expect(screen.getByText('GKE／EKS／AKS')).toBeInTheDocument()
  })

  it('provides a complete cross-topic container and Kubernetes knowledge atlas', () => {
    renderApp('/knowledge')
    expect(screen.getByRole('heading', { name: /把指令背後的系統/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Container 從指令到 Linux Process' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pod 與工作負載選型' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '從 Image 到 Cluster 的分層安全' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Helm、Kustomize 與 GitOps' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '正式叢集生命週期與平台治理' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '上線前，用證據回答八個問題' })).toBeInTheDocument()
    expect(screen.getByText('確認實際授權與安全設定')).toBeInTheDocument()
  })

  it('covers production troubleshooting and platform terminology', () => {
    renderApp('/troubleshooting')
    expect(screen.getByText('OOMKilled')).toBeInTheDocument()
    expect(screen.getByText('CreateContainerConfigError')).toBeInTheDocument()
    expect(screen.getByText('Rollout 卡住')).toBeInTheDocument()
  })
})

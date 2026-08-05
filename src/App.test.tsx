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
})

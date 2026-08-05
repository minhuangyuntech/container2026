import {
  Check,
  CloudCog,
  ExternalLink,
  HardDrive,
  Laptop2,
  MemoryStick,
  Network,
  ServerCog,
} from 'lucide-react'
import { CodeBlock } from './CodeBlock'
import {
  courseEnvironment,
  environmentRequirements,
  environmentSources,
  kubernetesImplementations,
  platformRecommendations,
} from '../data/environment'

const requirementIcons = [ServerCog, MemoryStick, HardDrive, Network]

const verifyCommands = {
  label: '安裝完成後的統一健康檢查',
  language: 'bash' as const,
  code: `docker version
docker compose version
kubectl version --client
kubectl config current-context
kubectl get nodes -o wide
kubectl get --raw=/version`,
}

export function EnvironmentSetupGuide() {
  return (
    <section className="lesson-section environment-section">
      <div className="section-index">01</div>
      <div className="lesson-section-body">
        <span className="mini-label">STARTER ENVIRONMENT</span>
        <h2>先決定版本，再選擇 Kubernetes 實作</h2>
        <p className="section-lead">
          「Kubernetes 版本」是 v1.36 這類上游 API 版本；kind、minikube、k3s 則是建立或提供 Kubernetes
          的不同方式。兩者是不同維度，也沒有一個固定的「實作總數」。
        </p>

        <div className="course-baseline">
          <div className="baseline-copy">
            <span><CloudCog size={19} />本站課程基準</span>
            <strong>{courseEnvironment.kubernetesBaseline}</strong>
            <p>
              教材以 2026 年 8 月仍受上游維護的版本為範圍，範例只使用穩定 API。
              若本機環境不是完全相同的小版本，也不必先重裝。
            </p>
          </div>
          <dl>
            <div><dt>相容範圍</dt><dd>{courseEnvironment.supportedRange}</dd></div>
            <div><dt>kubectl 建議</dt><dd>{courseEnvironment.kubectlRecommendation}</dd></div>
            <div><dt>Manifest API</dt><dd>{courseEnvironment.apiBaseline}</dd></div>
            <div><dt>內容檢視</dt><dd>{courseEnvironment.reviewedAt}</dd></div>
          </dl>
        </div>

        <div className="setup-subheading">
          <span>01 / REQUIREMENTS</span>
          <h3>這台電腦跑得動嗎？</h3>
          <p>最低規格能完成課程；建議規格能同時執行多個服務、Cluster 與瀏覽器而不容易卡頓。</p>
        </div>

        <div className="requirement-grid">
          {environmentRequirements.map((item, index) => {
            const Icon = requirementIcons[index]
            return (
              <article key={item.label}>
                <span><Icon size={20} /></span>
                <div><small>{item.label}</small><strong>{item.minimum}</strong></div>
                <p>{item.note}</p>
                <footer><Check size={14} />建議 {item.recommended}</footer>
              </article>
            )
          })}
        </div>

        <div className="platform-panel">
          <header><Laptop2 size={21} /><div><small>OPERATING SYSTEM</small><h3>依作業系統選擇安裝路徑</h3></div></header>
          <div className="platform-list">
            {platformRecommendations.map((item) => (
              <article key={item.platform}>
                <strong>{item.platform}</strong>
                <div><small>開始條件</small><p>{item.requirement}</p></div>
                <div><small>本站建議</small><p>{item.route}</p></div>
              </article>
            ))}
          </div>
        </div>

        <div className="setup-subheading">
          <span>02 / IMPLEMENTATIONS</span>
          <h3>七種常見實作，先選最符合學習目的的</h3>
          <p>這不是完整清單，而是學習者最常遇到的本機、輕量、自建與雲端方案。</p>
        </div>

        <div className="implementation-grid">
          {kubernetesImplementations.map((item) => (
            <article key={item.name} className={item.courseFit === '首選' ? 'recommended' : ''}>
              <header><span>{item.kind}</span><b>{item.courseFit}</b></header>
              <h4>{item.name}</h4>
              <strong>適合：{item.bestFor}</strong>
              <p>{item.tradeoff}</p>
            </article>
          ))}
        </div>

        <div className="course-route">
          <div>
            <span>最少設定</span>
            <strong>{courseEnvironment.primaryRoute}</strong>
            <p>Windows 與 macOS 初學者的本站預設路徑。</p>
          </div>
          <i>或</i>
          <div>
            <span>容易重建</span>
            <strong>{courseEnvironment.alternativeRoute}</strong>
            <p>想練習多次建立 Cluster，或日後銜接 CI 時選用。</p>
          </div>
        </div>

        <div className="version-rule">
          <strong>為什麼 kubectl 不必和 Cluster 完全相同？</strong>
          <p>
            Kubernetes 官方支援 <code>kubectl</code> 與 <code>kube-apiserver</code> 相差一個 minor version。
            例如 Cluster 是 v1.36，可使用 v1.35、v1.36 或 v1.37 的 kubectl；本站仍建議使用 v1.35 或 v1.36，讓畫面與輸出更接近教材。
          </p>
        </div>

        <div className="setup-subheading compact">
          <span>03 / VERIFY</span>
          <h3>完成安裝後，先跑這組檢查</h3>
          <p>所有指令都成功，再開始第 1 課；若尚未建立 Cluster，可先完成 Docker 章節。</p>
        </div>
        <CodeBlock block={verifyCommands} />

        <div className="official-source-row">
          <span>官方安裝與版本依據</span>
          <div>
            {environmentSources.map((source) => (
              <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                {source.label}<ExternalLink size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

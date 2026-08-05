import type { FoundationDiagramType } from '../data/foundations'

export function FoundationDiagram({ type }: { type: FoundationDiagramType }) {
  if (type === 'compose') return <ComposeDiagram />
  if (type === 'kubernetes') return <KubernetesDiagram />
  return <ContainerDiagram />
}

function DiagramFrame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <figure className="foundation-diagram">
      <svg viewBox="0 0 760 390" role="img" aria-labelledby="diagram-title diagram-description">
        <title id="diagram-title">{title}</title>
        <desc id="diagram-description">{description}</desc>
        <defs>
          <linearGradient id="diagram-panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#13283d" />
            <stop offset="1" stopColor="#0a1726" />
          </linearGradient>
          <linearGradient id="diagram-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5de8df" />
            <stop offset="1" stopColor="#2d98d4" />
          </linearGradient>
          <linearGradient id="diagram-violet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ab9cff" />
            <stop offset="1" stopColor="#725dd4" />
          </linearGradient>
          <filter id="diagram-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#43d8d3" />
          </marker>
          <marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#627d98" />
          </marker>
        </defs>
        {children}
      </svg>
      <figcaption>{title}</figcaption>
    </figure>
  )
}

function ContainerDiagram() {
  return (
    <DiagramFrame title="傳統安裝與容器化執行模型比較" description="傳統模式的應用共同依賴主機環境；容器模式將應用與依賴封裝，各容器共享主機核心但保持隔離。">
      <text x="34" y="34" className="svg-kicker">TRADITIONAL INSTALL</text>
      <text x="419" y="34" className="svg-kicker cyan">CONTAINER MODEL</text>

      <rect x="28" y="51" width="318" height="310" rx="18" className="svg-boundary" />
      <rect x="414" y="51" width="318" height="310" rx="18" className="svg-boundary cyan-boundary" />

      <g>
        <rect x="51" y="76" width="126" height="75" rx="11" className="svg-box" />
        <text x="114" y="101" textAnchor="middle" className="svg-title">APP A</text>
        <rect x="69" y="116" width="90" height="19" rx="5" className="svg-chip warning" />
        <text x="114" y="130" textAnchor="middle" className="svg-chip-text">LIB v1</text>

        <rect x="197" y="76" width="126" height="75" rx="11" className="svg-box" />
        <text x="260" y="101" textAnchor="middle" className="svg-title">APP B</text>
        <rect x="215" y="116" width="90" height="19" rx="5" className="svg-chip danger" />
        <text x="260" y="130" textAnchor="middle" className="svg-chip-text">LIB v2</text>

        <path d="M177 125 C187 108, 191 108, 197 125" className="svg-conflict" />
        <circle cx="187" cy="116" r="10" className="svg-alert" />
        <text x="187" y="120" textAnchor="middle" className="svg-alert-text">!</text>

        <rect x="51" y="181" width="272" height="67" rx="11" className="svg-layer" />
        <text x="187" y="207" textAnchor="middle" className="svg-title">Shared host libraries</text>
        <text x="187" y="228" textAnchor="middle" className="svg-note">版本與設定容易互相影響</text>
        <rect x="51" y="267" width="272" height="68" rx="11" className="svg-kernel" />
        <text x="187" y="296" textAnchor="middle" className="svg-title">Host OS + Kernel</text>
        <text x="187" y="317" textAnchor="middle" className="svg-note">一台主機，一組全域環境</text>
      </g>

      <g>
        {[438, 530, 622].map((x, index) => (
          <g key={x}>
            <rect x={x} y="76" width="78" height="112" rx="11" className="svg-container-box" />
            <rect x={x + 10} y="88" width="58" height="29" rx="6" className={index === 1 ? 'svg-chip violet' : 'svg-chip cyan'} />
            <text x={x + 39} y="107" textAnchor="middle" className="svg-chip-text dark">APP {String.fromCharCode(65 + index)}</text>
            <rect x={x + 10} y="127" width="58" height="22" rx="5" className="svg-inner-layer" />
            <text x={x + 39} y="142" textAnchor="middle" className="svg-small">LIBS</text>
            <rect x={x + 10} y="158" width="58" height="18" rx="5" className="svg-inner-layer" />
            <text x={x + 39} y="171" textAnchor="middle" className="svg-tiny">CONFIG</text>
          </g>
        ))}
        <rect x="438" y="207" width="262" height="48" rx="10" className="svg-runtime" />
        <text x="569" y="237" textAnchor="middle" className="svg-title dark">Container Runtime</text>
        <rect x="438" y="273" width="262" height="62" rx="11" className="svg-kernel" />
        <text x="569" y="299" textAnchor="middle" className="svg-title">Shared Host Kernel</text>
        <text x="569" y="320" textAnchor="middle" className="svg-note">process、network、filesystem 隔離</text>
        <path d="M477 188 V207 M569 188 V207 M661 188 V207" className="svg-link" />
      </g>
    </DiagramFrame>
  )
}

function ComposeDiagram() {
  return (
    <DiagramFrame title="Docker Compose 多服務應用模型" description="Compose 建立一個應用專用網路，Web、API、資料庫、快取與背景工作可透過服務名稱互相連線，資料庫使用命名儲存卷。">
      <rect x="27" y="40" width="706" height="303" rx="20" className="svg-boundary cyan-boundary" />
      <rect x="45" y="24" width="156" height="30" rx="8" className="svg-label-bg" />
      <text x="123" y="44" textAnchor="middle" className="svg-kicker cyan">COMPOSE NETWORK</text>

      <g>
        <rect x="60" y="101" width="112" height="75" rx="12" className="svg-client" />
        <text x="116" y="130" textAnchor="middle" className="svg-title dark">Browser</text>
        <text x="116" y="151" textAnchor="middle" className="svg-small dark">localhost:8080</text>
      </g>

      <g>
        <rect x="225" y="80" width="125" height="110" rx="13" className="svg-container-box" />
        <rect x="239" y="94" width="97" height="31" rx="7" className="svg-chip cyan" />
        <text x="287" y="114" textAnchor="middle" className="svg-chip-text dark">WEB</text>
        <text x="287" y="149" textAnchor="middle" className="svg-title">web:80</text>
        <text x="287" y="171" textAnchor="middle" className="svg-note">public entry</text>
      </g>

      <g>
        <rect x="405" y="80" width="125" height="110" rx="13" className="svg-container-box" />
        <rect x="419" y="94" width="97" height="31" rx="7" className="svg-chip violet" />
        <text x="467" y="114" textAnchor="middle" className="svg-chip-text dark">API</text>
        <text x="467" y="149" textAnchor="middle" className="svg-title">api:3000</text>
        <text x="467" y="171" textAnchor="middle" className="svg-note">business logic</text>
      </g>

      <g>
        <rect x="585" y="80" width="118" height="110" rx="13" className="svg-container-box" />
        <rect x="599" y="94" width="90" height="31" rx="7" className="svg-chip cyan" />
        <text x="644" y="114" textAnchor="middle" className="svg-chip-text dark">DB</text>
        <text x="644" y="149" textAnchor="middle" className="svg-title">db:5432</text>
        <text x="644" y="171" textAnchor="middle" className="svg-note">persistent data</text>
      </g>

      <path d="M172 138 H225" className="svg-arrow" />
      <path d="M350 138 H405" className="svg-arrow" />
      <path d="M530 138 H585" className="svg-arrow" />
      <text x="377" y="126" textAnchor="middle" className="svg-tiny">SERVICE DNS</text>

      <g>
        <rect x="225" y="237" width="125" height="70" rx="12" className="svg-box" />
        <text x="287" y="265" textAnchor="middle" className="svg-title">Worker</text>
        <text x="287" y="286" textAnchor="middle" className="svg-note">background job</text>
        <rect x="405" y="237" width="125" height="70" rx="12" className="svg-box" />
        <text x="467" y="265" textAnchor="middle" className="svg-title">Redis</text>
        <text x="467" y="286" textAnchor="middle" className="svg-note">redis:6379</text>
        <ellipse cx="644" cy="258" rx="54" ry="15" className="svg-volume-top" />
        <path d="M590 258 V292 C590 301 614 308 644 308 C674 308 698 301 698 292 V258" className="svg-volume" />
        <text x="644" y="285" textAnchor="middle" className="svg-small dark">VOLUME</text>
      </g>
      <path d="M405 272 H350" className="svg-arrow reverse" />
      <path d="M467 190 V237" className="svg-link" />
      <path d="M644 190 V243" className="svg-link" />
      <text x="55" y="329" className="svg-note">一份 compose.yaml 描述 services · networks · volumes · healthchecks</text>
    </DiagramFrame>
  )
}

function KubernetesDiagram() {
  return (
    <DiagramFrame title="Kubernetes 期望狀態與自我修復模型" description="使用者將期望狀態送到 API Server，Controller 與 Scheduler 管理兩個節點上的 Pod，Service 將流量導向健康副本。">
      <rect x="25" y="28" width="710" height="335" rx="20" className="svg-boundary" />
      <text x="48" y="53" className="svg-kicker cyan">KUBERNETES CLUSTER</text>

      <g>
        <rect x="51" y="78" width="230" height="114" rx="14" className="svg-control-plane" />
        <text x="70" y="101" className="svg-kicker violet-text">CONTROL PLANE</text>
        <rect x="68" y="116" width="62" height="49" rx="8" className="svg-box" />
        <text x="99" y="145" textAnchor="middle" className="svg-small">API</text>
        <rect x="139" y="116" width="60" height="49" rx="8" className="svg-box" />
        <text x="169" y="145" textAnchor="middle" className="svg-tiny">SCHEDULER</text>
        <rect x="208" y="116" width="56" height="49" rx="8" className="svg-box" />
        <text x="236" y="139" textAnchor="middle" className="svg-tiny">CTRL</text>
        <text x="236" y="151" textAnchor="middle" className="svg-tiny">MGR</text>
      </g>

      <g>
        <rect x="337" y="77" width="178" height="113" rx="14" className="svg-node" />
        <text x="355" y="100" className="svg-kicker">NODE A</text>
        <rect x="354" y="117" width="66" height="53" rx="9" className="svg-pod healthy" />
        <text x="387" y="140" textAnchor="middle" className="svg-small dark">POD</text>
        <text x="387" y="157" textAnchor="middle" className="svg-tiny dark">Ready</text>
        <rect x="432" y="117" width="66" height="53" rx="9" className="svg-pod healthy" />
        <text x="465" y="140" textAnchor="middle" className="svg-small dark">POD</text>
        <text x="465" y="157" textAnchor="middle" className="svg-tiny dark">Ready</text>

        <rect x="536" y="77" width="174" height="113" rx="14" className="svg-node" />
        <text x="554" y="100" className="svg-kicker">NODE B</text>
        <rect x="553" y="117" width="66" height="53" rx="9" className="svg-pod healthy" />
        <text x="586" y="140" textAnchor="middle" className="svg-small dark">POD</text>
        <text x="586" y="157" textAnchor="middle" className="svg-tiny dark">Ready</text>
        <rect x="631" y="117" width="62" height="53" rx="9" className="svg-pod failed" />
        <text x="662" y="140" textAnchor="middle" className="svg-small">POD</text>
        <text x="662" y="157" textAnchor="middle" className="svg-tiny">Failed</text>
      </g>

      <path d="M281 139 H337" className="svg-arrow" />
      <path d="M236 165 C266 222, 326 220, 367 184" className="svg-reconcile" />
      <path d="M236 165 C302 243, 566 238, 585 185" className="svg-reconcile" />
      <text x="356" y="221" className="svg-tiny cyan">SCHEDULE · RECONCILE</text>

      <g>
        <rect x="263" y="263" width="196" height="62" rx="13" className="svg-service" />
        <text x="361" y="288" textAnchor="middle" className="svg-title dark">SERVICE</text>
        <text x="361" y="309" textAnchor="middle" className="svg-small dark">stable DNS · healthy endpoints</text>
        <rect x="51" y="263" width="145" height="62" rx="13" className="svg-client" />
        <text x="123" y="289" textAnchor="middle" className="svg-title dark">Traffic</text>
        <text x="123" y="309" textAnchor="middle" className="svg-small dark">client requests</text>
      </g>
      <path d="M196 294 H263" className="svg-arrow" />
      <path d="M417 263 C421 226, 402 209, 387 171" className="svg-arrow" />
      <path d="M429 263 C472 224, 548 215, 586 171" className="svg-arrow" />
      <path d="M662 171 C694 202, 700 225, 681 248" className="svg-failure-path" />
      <rect x="600" y="263" width="110" height="62" rx="12" className="svg-replacement" />
      <text x="655" y="288" textAnchor="middle" className="svg-small dark">NEW POD</text>
      <text x="655" y="307" textAnchor="middle" className="svg-tiny dark">self-healing</text>
      <path d="M600 294 H459" className="svg-arrow reverse" />
      <text x="502" y="345" className="svg-note">Deployment desired replicas: 3 · actual healthy replicas: 3</text>
    </DiagramFrame>
  )
}

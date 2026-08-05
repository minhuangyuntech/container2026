export type EnvironmentRequirement = {
  label: string
  minimum: string
  recommended: string
  note: string
}

export type PlatformRecommendation = {
  platform: string
  requirement: string
  route: string
}

export type KubernetesImplementation = {
  name: string
  kind: string
  bestFor: string
  tradeoff: string
  courseFit: '首選' | '適用' | '進階'
}

export const courseEnvironment = {
  reviewedAt: '2026 年 8 月',
  kubernetesBaseline: 'Kubernetes v1.36',
  supportedRange: 'v1.34–v1.36',
  kubectlRecommendation: 'kubectl v1.35 或 v1.36',
  apiBaseline: 'core/v1、apps/v1',
  primaryRoute: 'Docker Desktop 內建 Kubernetes',
  alternativeRoute: 'Docker Desktop + kind',
}

export const environmentRequirements: EnvironmentRequirement[] = [
  {
    label: 'CPU',
    minimum: '2 核心',
    recommended: '4 核心以上',
    note: '需支援並開啟硬體虛擬化；Apple silicon 與 x86-64 均可。',
  },
  {
    label: '記憶體',
    minimum: '8 GB RAM',
    recommended: '16 GB RAM',
    note: 'Docker、Kubernetes 與瀏覽器會同時使用記憶體，8 GB 可學習但要控制其他程式。',
  },
  {
    label: '磁碟',
    minimum: '20 GB 可用空間',
    recommended: '30 GB 以上',
    note: 'Image、build cache 與本機 Cluster 會持續占用空間，請定期檢查而非任意清除 Volume。',
  },
  {
    label: '網路',
    minimum: '可連線 HTTPS',
    recommended: '穩定寬頻',
    note: '第一次建立環境需要下載 Image、Kubernetes node image 與套件。',
  },
]

export const platformRecommendations: PlatformRecommendation[] = [
  {
    platform: 'Windows',
    requirement: 'Windows 11 23H2+、WSL 2.1.5+、BIOS/UEFI 已開啟虛擬化',
    route: 'Docker Desktop 使用 WSL 2 backend；課程指令建議在同一個 PowerShell 或 WSL 終端機完成。',
  },
  {
    platform: 'macOS',
    requirement: 'Docker 官方支援的 macOS 版本、至少 4 GB RAM；本站建議 8 GB 以上',
    route: '依 Apple silicon 或 Intel 安裝對應的 Docker Desktop，再啟用 Kubernetes 或安裝 kind。',
  },
  {
    platform: 'Linux',
    requirement: '64-bit Linux、systemd、2 CPU 與 8 GB RAM；Ubuntu 22.04/24.04 最容易跟課',
    route: '安裝受支援的 Docker Engine 與 Compose v2 plugin，再選 kind 或 minikube。',
  },
]

export const kubernetesImplementations: KubernetesImplementation[] = [
  {
    name: 'Docker Desktop Kubernetes',
    kind: '桌面整合',
    bestFor: '第一次學習、Windows／macOS',
    tradeoff: '安裝與 context 設定最少；版本由 Docker Desktop 提供，可能略晚於上游最新版。',
    courseFit: '首選',
  },
  {
    name: 'kind',
    kind: 'Container-based',
    bestFor: '可重建 Lab、CI、自動測試',
    tradeoff: '把 Kubernetes Node 跑在 Docker Container 中，建立與刪除很快，但不是長期正式環境。',
    courseFit: '首選',
  },
  {
    name: 'minikube',
    kind: '本機單節點',
    bestFor: '跨平台學習、需要 addons',
    tradeoff: '可選 Docker、VM 等 driver，功能完整；選項較多，初次設定也較多。',
    courseFit: '適用',
  },
  {
    name: 'k3s',
    kind: '輕量發行版',
    bestFor: 'Linux、Edge、低資源裝置',
    tradeoff: '安裝小、啟動快，預設元件與完整上游安裝略有差異。',
    courseFit: '適用',
  },
  {
    name: 'MicroK8s',
    kind: '輕量發行版',
    bestFor: 'Ubuntu、工作站與小型叢集',
    tradeoff: 'addons 與更新管理方便；Snap 與命令使用方式帶有發行版特色。',
    courseFit: '適用',
  },
  {
    name: 'kubeadm',
    kind: '上游建置工具',
    bestFor: '理解 Control Plane 與正式叢集建置',
    tradeoff: '最接近自行維運的叢集，需要 Linux、網路、CNI、憑證與多節點知識。',
    courseFit: '進階',
  },
  {
    name: 'GKE／EKS／AKS',
    kind: '雲端託管',
    bestFor: '正式環境、雲端整合與高可用',
    tradeoff: '雲端商代管 Control Plane，但會產生費用，也需要 IAM、網路與成本管理知識。',
    courseFit: '進階',
  },
]

export const environmentSources = [
  { label: 'Kubernetes 學習環境', href: 'https://kubernetes.io/docs/setup/learning-environment/' },
  { label: 'Kubernetes 版本偏差政策', href: 'https://kubernetes.io/releases/version-skew-policy/' },
  { label: '安裝 kubectl', href: 'https://kubernetes.io/docs/tasks/tools/' },
  { label: 'Docker Desktop 系統需求', href: 'https://docs.docker.com/desktop/' },
]

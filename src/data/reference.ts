export type CheatGroup = {
  title: string
  accent: 'docker' | 'kubernetes'
  items: Array<{ command: string; description: string }>
}

export const cheatGroups: CheatGroup[] = [
  {
    title: 'Container 生命週期',
    accent: 'docker',
    items: [
      { command: 'docker run -d --name web -p 8080:80 nginx', description: '背景啟動並對應 port' },
      { command: 'docker ps -a', description: '列出執行中與已停止的 Container' },
      { command: 'docker logs -f --tail=100 web', description: '持續查看最近 100 行 log' },
      { command: 'docker exec -it web sh', description: '在執行中的 Container 開啟 shell' },
      { command: 'docker stop web && docker rm web', description: '停止並移除 Container' },
    ],
  },
  {
    title: 'Image 與建置',
    accent: 'docker',
    items: [
      { command: 'docker build -t app:1.0.0 .', description: '以目前目錄為 context 建置 Image' },
      { command: 'docker image ls', description: '列出本機 Image' },
      { command: 'docker history app:1.0.0', description: '查看 Image layer' },
      { command: 'docker tag app:1.0.0 user/app:1.0.0', description: '建立適合 Registry 的 tag' },
      { command: 'docker image prune', description: '清理未使用的 dangling Image' },
    ],
  },
  {
    title: 'Docker Compose',
    accent: 'docker',
    items: [
      { command: 'docker compose up -d --build', description: '建置並背景啟動所有服務' },
      { command: 'docker compose ps', description: '查看此 Compose project 的服務' },
      { command: 'docker compose logs -f api', description: '追蹤指定服務 log' },
      { command: 'docker compose exec api sh', description: '進入指定服務 Container' },
      { command: 'docker compose down', description: '停止並移除服務與預設網路' },
    ],
  },
  {
    title: 'Kubernetes 探索與除錯',
    accent: 'kubernetes',
    items: [
      { command: 'kubectl get pods -o wide', description: '查看 Pod、Node、IP 與狀態' },
      { command: 'kubectl describe pod <name>', description: '查看詳細狀態與 events' },
      { command: 'kubectl logs <pod> --previous', description: '查看上一次已退出 Container 的 log' },
      { command: 'kubectl exec -it <pod> -- sh', description: '在 Pod 內執行 shell' },
      { command: 'kubectl get events --sort-by=.metadata.creationTimestamp', description: '依時間查看叢集事件' },
    ],
  },
  {
    title: '部署與發布',
    accent: 'kubernetes',
    items: [
      { command: 'kubectl apply -f k8s/', description: '套用目錄內的 manifests' },
      { command: 'kubectl rollout status deploy/app', description: '等待 Deployment 更新完成' },
      { command: 'kubectl scale deploy/app --replicas=3', description: '調整副本數' },
      { command: 'kubectl rollout history deploy/app', description: '查看發布歷史' },
      { command: 'kubectl rollout undo deploy/app', description: '回復上一個 revision' },
    ],
  },
]

export const troubleshooting = [
  { status: 'Port is already allocated', area: 'Docker', symptom: '啟動 Container 時無法綁定主機 port。', checks: ['docker ps 查看目前 port mapping', 'Windows 可用 netstat -ano 檢查 port'], fix: '停止佔用者，或將 -p 左側主機 port 改成 8081 等未使用值。' },
  { status: 'Cannot connect to Docker daemon', area: 'Docker', symptom: '所有 docker 指令都無法連到 Engine。', checks: ['確認 Docker Desktop 已完成啟動', 'docker context ls 查看目前 context'], fix: '啟動 Engine，並切回正確 Docker context；Linux 另檢查 socket 權限。' },
  { status: 'CrashLoopBackOff', area: 'Kubernetes', symptom: 'Container 啟動後不斷退出，重啟間隔逐漸增加。', checks: ['kubectl logs <pod> --previous', 'kubectl describe pod <pod>', '檢查 command、env 與 probes'], fix: '依退出碼與 log 修正應用設定；probe 過早時調整 initialDelay 或 startupProbe。' },
  { status: 'ImagePullBackOff', area: 'Kubernetes', symptom: 'Node 無法取得 Pod 指定的 Image。', checks: ['kubectl describe pod 查看 pull event', '確認 Image 名稱、tag 與 registry 權限'], fix: '修正 Image reference；私有 Registry 設定 imagePullSecrets；kind 需將本機 Image 載入節點。' },
  { status: 'Pending', area: 'Kubernetes', symptom: 'Pod 長時間沒有被排程到 Node。', checks: ['kubectl describe pod 查看 FailedScheduling', '比較 requests 與 Node 可用資源', '檢查 PVC、taint 與 affinity'], fix: '降低不合理 requests、補足儲存或排程條件，或增加具備所需資源的 Node。' },
  { status: 'Service 沒有流量', area: 'Kubernetes', symptom: 'Service 存在，但連線逾時或拒絕。', checks: ['kubectl get endpointslice', '比較 Service selector 與 Pod labels', '檢查 readiness 與 targetPort'], fix: '修正 selector/label 或 targetPort，並確保至少一個 Pod Ready。' },
]

export const glossary = [
  { term: 'Image', zh: '容器映像', definition: '建立 Container 的唯讀模板，包含檔案系統、程式與啟動設定。' },
  { term: 'Container', zh: '容器', definition: '由 Image 建立的隔離 process，以及其可寫層與執行設定。' },
  { term: 'Registry', zh: '映像倉庫服務', definition: '儲存與散布 Image 的服務，例如 Docker Hub 或 GitHub Container Registry。' },
  { term: 'Volume', zh: '儲存卷', definition: '將資料生命週期從 Container 可寫層中分離的儲存機制。' },
  { term: 'Cluster', zh: '叢集', definition: '由 control plane 與一個或多個工作節點組成的 Kubernetes 系統。' },
  { term: 'Node', zh: '節點', definition: '實際執行 Pod 的實體機或虛擬機。' },
  { term: 'Pod', zh: 'Pod', definition: 'Kubernetes 最小排程單位；其中的 Container 共享網路與宣告的 volume。' },
  { term: 'Deployment', zh: '部署資源', definition: '管理無狀態 Pod 副本與版本更新的 controller。' },
  { term: 'Service', zh: '服務', definition: '透過 selector 為一組 Pod 提供穩定網路身分與流量入口。' },
  { term: 'Namespace', zh: '命名空間', definition: '在同一 Cluster 中組織與隔離 Kubernetes 資源的邏輯範圍。' },
  { term: 'ConfigMap', zh: '設定映射', definition: '保存非敏感設定，可注入 Pod 作為環境變數或檔案。' },
  { term: 'Secret', zh: '機密資源', definition: '專門承載敏感資料的 API 資源；仍需權限、傳輸與靜態加密保護。' },
  { term: 'Ingress', zh: 'HTTP 入口規則', definition: '描述從叢集外部到 Service 的 HTTP/HTTPS 路由，需要 Ingress Controller 實作。' },
  { term: 'Reconciliation', zh: '狀態調和', definition: 'Controller 持續讓實際狀態接近期望狀態的控制迴圈。' },
]

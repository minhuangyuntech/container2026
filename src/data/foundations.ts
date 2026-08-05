export type FoundationDiagramType = 'container' | 'compose' | 'kubernetes'

export type FoundationGuide = {
  lessonId: string
  label: string
  title: string
  intro: string
  diagram: FoundationDiagramType
  definition: {
    title: string
    body: string
    keyPoint: string
  }
  reasons: Array<{
    problem: string
    symptom: string
    answer: string
  }>
  solves: Array<{ title: string; body: string }>
  limits: Array<{ title: string; body: string }>
  commands: Array<{ command: string; meaning: string; useWhen: string }>
  practice: {
    title: string
    goal: string
    steps: string[]
    observe: string
  }
}

export const foundationGuides: FoundationGuide[] = [
  {
    lessonId: 'container-basics',
    label: 'CONTAINER FOUNDATION',
    title: '什麼是容器？為什麼現代交付需要它？',
    intro: '先不要把容器想成一台比較小的虛擬機。容器的核心，是把應用程式及其執行所需內容包裝起來，再用作業系統層級的隔離機制，以一致方式啟動成一個 process。',
    diagram: 'container',
    definition: {
      title: '容器是「由 Image 啟動的隔離程序」',
      body: 'Image 提供唯讀檔案系統、程式、函式庫與預設啟動設定；Container 則是在執行時加入可寫層、網路、資源限制與生命週期的實例。多個 Container 可以共享主機 Kernel，但擁有各自的 process、網路與檔案系統視圖。',
      keyPoint: 'Image 是可攜、可版本化的交付物；Container 是它在某個環境中的一次執行。',
    },
    reasons: [
      { problem: '環境不一致', symptom: '開發機可以執行，上線後卻因版本、套件或設定不同而失敗。', answer: '把 runtime 與依賴封裝進 Image，讓不同環境執行同一份產物。' },
      { problem: '相依套件互相衝突', symptom: '同一台主機上的兩個服務需要不同版本的語言、函式庫或系統工具。', answer: '每個 Container 使用自己的檔案系統與設定，降低服務之間的干擾。' },
      { problem: '部署流程難以重現', symptom: '依賴人工登入主機、照文件逐項安裝，容易遺漏且不易回復。', answer: '用 Dockerfile 將建置流程程式碼化，再以 Image tag 精準部署或回復。' },
    ],
    solves: [
      { title: '一致交付', body: '開發、測試、CI 與正式環境可以使用相同 Image，減少環境漂移。' },
      { title: '快速啟停', body: 'Container 不需開機完整 Guest OS，通常能在短時間內建立、替換與擴展。' },
      { title: '應用隔離', body: 'namespace、cgroups 與獨立檔案系統視圖讓服務彼此更獨立，也能限制資源。' },
      { title: '版本化發布', body: 'Image tag 或 digest 能對應明確產物，利於稽核、測試與 rollback。' },
    ],
    limits: [
      { title: '不是完整安全邊界', body: 'Container 共享主機 Kernel，仍要採最小權限、修補漏洞並避免特權模式。' },
      { title: '不會自動保存資料', body: 'Container 可寫層會隨移除而消失；重要資料需要 Volume 與備份策略。' },
      { title: '不會自動解決分散式系統', body: '網路延遲、資料一致性、監控與服務設計仍需要額外規劃。' },
    ],
    commands: [
      { command: 'docker run -d --name web -p 8080:80 nginx:alpine', meaning: '由 Image 建立並在背景啟動 Container', useWhen: '第一次啟動服務' },
      { command: 'docker ps -a', meaning: '列出執行中及已停止的 Container', useWhen: '確認生命週期狀態' },
      { command: 'docker logs -f --tail=100 web', meaning: '持續讀取最近的標準輸出與錯誤', useWhen: '服務異常或需要觀察請求' },
      { command: 'docker exec -it web sh', meaning: '在執行中的 Container 內啟動程序', useWhen: '檢查檔案、網路或環境變數' },
      { command: 'docker inspect web', meaning: '查看完整執行設定、IP、掛載與狀態', useWhen: '需要比 ps 更完整的證據' },
      { command: 'docker stop web && docker rm web', meaning: '停止並移除 Container', useWhen: '結束實驗或以新版重建' },
    ],
    practice: {
      title: '重要實作：觀察一次完整生命週期',
      goal: '啟動 Nginx、確認 port mapping、讀 log、進入 Container，最後刪除並用同一個 Image 重建。',
      steps: ['run：從 Image 建立執行個體', 'ps / inspect：讀取實際狀態', 'logs / exec：觀察程序內外', 'stop / rm：理解 Container 是可替換的'],
      observe: '刪除 Container 不會刪除 Image；再次 docker run 會建立一個新的 Container ID。',
    },
  },
  {
    lessonId: 'compose',
    label: 'COMPOSE FOUNDATION',
    title: '為什麼需要 Docker Compose？',
    intro: '單一 docker run 適合理解 Container；當應用同時有 Web、API、資料庫、快取與背景工作時，手動維護多組參數會變得脆弱。Compose 用一份 YAML 描述整個多容器應用。',
    diagram: 'compose',
    definition: {
      title: 'Compose 是「單機多容器應用的宣告檔與操作工具」',
      body: 'compose.yaml 定義 services、networks、volumes、環境變數、healthcheck 與啟動相依。Docker Compose 讀取這份檔案後，建立共同網路並依設定啟動整組服務。',
      keyPoint: 'Compose 管理的是一組彼此合作的服務，不只是縮短 docker run 指令。',
    },
    reasons: [
      { problem: '指令參數散落', symptom: '每位開發者保存不同版本的 docker run 指令，port、volume 和環境變數逐漸不一致。', answer: '把設定集中在可版本控制的 compose.yaml，變更可審查、可重現。' },
      { problem: '服務找不到彼此', symptom: 'API、資料庫與快取分別啟動，IP 會變且 localhost 指向錯誤位置。', answer: 'Compose 建立專用 network，服務以 service name 作為穩定 DNS 名稱。' },
      { problem: '啟動與清理繁瑣', symptom: '一次開發環境需要執行多條命令，結束後還殘留 Container、network 或 volume。', answer: '用 up、ps、logs、down 以 project 為單位操作完整環境。' },
    ],
    solves: [
      { title: '一鍵建立環境', body: 'docker compose up 依一份設定建立所有服務、網路與指定 Volume。' },
      { title: '內建服務探索', body: '同一 Compose network 的服務可用 service name 互相連線，不追蹤動態 IP。' },
      { title: '開發環境標準化', body: '團隊與 CI 可以共用同一套多服務拓樸，減少口頭設定與人工步驟。' },
      { title: '集中觀察', body: '可以查看整個 project 或單一 service 的狀態與 log。' },
    ],
    limits: [
      { title: '主要面向單一 Docker Host', body: 'Compose 很適合本機開發與單機部署，但不是跨多節點的完整排程器。' },
      { title: 'depends_on 不等於服務已就緒', body: '啟動順序不能保證資料庫已接受連線；需要 healthcheck 與應用重試。' },
      { title: '祕密不應直接寫進 YAML', body: '敏感資料需透過環境注入或 Secret 管理，避免提交到 Git。' },
    ],
    commands: [
      { command: 'docker compose config', meaning: '解析並顯示合併後的最終設定', useWhen: '啟動前檢查 YAML 與變數' },
      { command: 'docker compose up -d --build', meaning: '需要時建置 Image，並在背景啟動所有服務', useWhen: '建立或更新開發環境' },
      { command: 'docker compose ps', meaning: '查看此 project 服務狀態與 port', useWhen: '快速確認哪些服務健康' },
      { command: 'docker compose logs -f api', meaning: '持續查看指定 service 的 log', useWhen: '聚焦 API 等單一服務除錯' },
      { command: 'docker compose exec api sh', meaning: '在指定 service 的 Container 內執行 shell', useWhen: '確認內部 DNS、檔案或設定' },
      { command: 'docker compose down', meaning: '移除 Container 與預設 network，預設保留 named volume', useWhen: '結束整組環境' },
    ],
    practice: {
      title: '重要實作：Web、API、Database 三層服務',
      goal: '建立共同 network，讓 Web 呼叫 API、API 以 db:5432 連資料庫，並以 named volume 保存資料。',
      steps: ['config：確認變數展開後的最終 YAML', 'up：建立 services、network 與 volume', 'exec：從 API Container 驗證 db DNS', 'down / up：確認資料能跨 Container 重建保留'],
      observe: 'Container 被重建時 IP 可能改變，但 service name 與 named volume 仍提供穩定身分。',
    },
  },
  {
    lessonId: 'k8s-map',
    label: 'KUBERNETES FOUNDATION',
    title: '為什麼需要 Kubernetes？',
    intro: 'Container 解決「如何一致地包裝與執行」，Compose 解決「如何在一台主機組合多個服務」。當服務要跨多台機器運行、持續修復、擴展並無中斷更新時，就需要容器編排器。',
    diagram: 'kubernetes',
    definition: {
      title: 'Kubernetes 是「持續讓實際狀態接近期望狀態的容器編排平台」',
      body: '你透過 API 宣告 Deployment 需要幾個 replicas、使用哪個 Image、需要多少資源與如何檢查健康。Controller、Scheduler 與各 Node 上的 kubelet 共同將這份期望轉成實際執行的 Pod。',
      keyPoint: 'Kubernetes 的價值不是啟動 Container，而是持續管理大量 Container 的狀態與變化。',
    },
    reasons: [
      { problem: '服務需要跨多台主機', symptom: '人工選擇主機容易造成資源不均，機器故障後也要手動搬移服務。', answer: 'Scheduler 依 requests 與規則選擇 Node，Controller 在故障時補回 Pod。' },
      { problem: '發布不能中斷服務', symptom: '直接停止舊版本再啟動新版會產生停機，也難以控制失敗範圍。', answer: 'Deployment 用 RollingUpdate 漸進替換 Pod，並保留 revision 供 rollback。' },
      { problem: '服務副本與 IP 持續變動', symptom: '擴展、更新與自我修復都會產生新 Pod，呼叫端無法依賴固定 IP。', answer: 'Service 以 label selector 找到 Ready Pod，提供穩定 DNS 與流量入口。' },
    ],
    solves: [
      { title: '自我修復', body: 'Pod 或 Node 異常時，Controller 會依期望副本數建立替代 Pod。' },
      { title: '彈性擴展', body: '可手動或依指標調整 replicas，將工作分散到叢集節點。' },
      { title: '宣告式發布', body: '透過 manifest 與 rollout 管理版本，變更可審查、可追蹤、可回復。' },
      { title: '服務探索與負載分配', body: 'Service 與 DNS 將穩定名稱導向目前健康的 Pod。' },
    ],
    limits: [
      { title: '增加系統複雜度', body: '叢集本身需要升級、監控、權限、安全、成本與容量管理。' },
      { title: '不會修正應用架構', body: '錯誤的健康檢查、無狀態假設或資料一致性問題，導入 Kubernetes 後仍然存在。' },
      { title: '小型單機服務可能不需要', body: '若只有少量服務且不需多節點、自我修復或進階發布，Compose 可能更合適。' },
    ],
    commands: [
      { command: 'kubectl config current-context', meaning: '顯示目前操作的 Cluster context', useWhen: '每次變更資源之前' },
      { command: 'kubectl get pods -o wide', meaning: '查看 Pod 狀態、IP 與所在 Node', useWhen: '掌握整體執行狀態' },
      { command: 'kubectl describe pod <name>', meaning: '查看條件、Container 狀態與 Events', useWhen: 'Pending、重啟或 probe 失敗' },
      { command: 'kubectl logs <pod> --previous', meaning: '查看前一次已退出 Container 的 log', useWhen: 'CrashLoopBackOff' },
      { command: 'kubectl apply -f k8s/', meaning: '將 manifests 宣告的期望狀態送到 API Server', useWhen: '建立或更新資源' },
      { command: 'kubectl rollout status deploy/app', meaning: '等待並觀察 Deployment 發布結果', useWhen: '更新 Image 或 Pod template' },
    ],
    practice: {
      title: '重要實作：故障、自我修復與滾動更新',
      goal: '部署三個 replicas、刪除其中一個 Pod 觀察補回，再更新 Image 並檢查 rollout history。',
      steps: ['apply：宣告 Deployment 與 Service', 'delete pod：模擬單一 Pod 故障', 'get / describe：觀察 Controller 補回副本', 'set image / rollout：發布並在必要時 undo'],
      observe: '重點不是 Pod 名稱維持不變，而是服務的期望副本數與可用性被持續維持。',
    },
  },
]

export function getFoundationGuide(lessonId: string) {
  return foundationGuides.find((guide) => guide.lessonId === lessonId)
}

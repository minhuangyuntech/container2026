export type CommandBlock = {
  label: string
  language: 'bash' | 'yaml' | 'dockerfile' | 'powershell'
  code: string
}

export type Quiz = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type Lesson = {
  id: string
  number: number
  phase: '準備' | 'Docker' | 'Kubernetes'
  title: string
  shortTitle: string
  duration: string
  level: '入門' | '核心' | '實戰'
  summary: string
  objectives: string[]
  concepts: Array<{ title: string; body: string }>
  flow: string[]
  lab: {
    title: string
    intro: string
    steps: string[]
    commands: CommandBlock[]
    success: string[]
  }
  note?: string
  pitfalls: Array<{ title: string; fix: string }>
  quiz: Quiz
}

export const lessons: Lesson[] = [
  {
    id: 'ready',
    number: 0,
    phase: '準備',
    title: '準備你的容器實驗室',
    shortTitle: '環境準備',
    duration: '35 分鐘',
    level: '入門',
    summary: '先確認電腦規格、版本相容性與本機 Kubernetes 實作，再建立之後每一課都能重複使用的安全實驗環境。',
    objectives: ['確認電腦與虛擬化符合需求', '分辨 Kubernetes 版本與實作方式', '安裝並驗證 Docker、Compose、kubectl 與本機叢集'],
    concepts: [
      {
        title: '先建立一致的起跑線',
        body: '容器課最常見的挫折不是觀念，而是工具尚未啟動或 CLI 連到錯誤的環境。先確認版本與連線狀態，後面每個問題就能聚焦在真正的學習目標。',
      },
      {
        title: '本站使用什麼版本與環境？',
        body: '本站以 Kubernetes v1.36 與穩定的 core/v1、apps/v1 API 為教材基準，相容 v1.34–v1.36。Windows 與 macOS 預設使用 Docker Desktop 內建 Kubernetes，kind 是可快速重建的首選替代方案。',
      },
    ],
    flow: ['Docker Engine', 'kubectl', 'Local cluster'],
    lab: {
      title: 'Lab 00 — 健康檢查',
      intro: '依序確認 Docker、Compose、kubectl 與 Cluster。若還沒啟用 Kubernetes，可以先完成 Docker 段落，進入第 5 課前再補上。',
      steps: ['確認 CPU 虛擬化已開啟，Windows 使用者另外確認 WSL 2。', '開啟 Docker Desktop 或啟動 Docker Engine。', '檢查 Docker、Compose 與 kubectl 版本。', '確認 kubectl 指向學習用 context，並取得 Server 版本與 Ready Node。'],
      commands: [
        { label: 'Windows 先確認 WSL 2', language: 'powershell', code: 'wsl --version\nwsl --status' },
        { label: '檢查 Docker 與 Compose', language: 'bash', code: 'docker version\ndocker compose version\ndocker info' },
        { label: '檢查 Kubernetes', language: 'bash', code: 'kubectl version --client\nkubectl config get-contexts\nkubectl config current-context\nkubectl get --raw=/version\nkubectl get nodes -o wide' },
      ],
      success: ['docker version 同時顯示 Client 與 Server，docker compose 回傳 v2', 'kubectl 指向學習用 context，Server 位於 v1.34–v1.36', 'kubectl get nodes 至少顯示一個 Ready 節點'],
    },
    note: 'Windows 使用者建議採用 WSL 2 backend。不要同時在 Windows 與 WSL 內各安裝一套 Docker Engine，以免 CLI、socket 與 context 指向不同環境。',
    pitfalls: [
      { title: 'Cannot connect to the Docker daemon', fix: '先確認 Docker Desktop 已完成啟動，再檢查目前 Docker context。' },
      { title: 'kubectl 無法連線', fix: '執行 kubectl config get-contexts，切換到本機叢集對應的 context。' },
    ],
    quiz: {
      question: '若 kube-apiserver 是 v1.36，依官方版本偏差政策，哪一組 kubectl minor version 受到支援？',
      options: ['只有 v1.36', 'v1.35、v1.36、v1.37', 'v1.32 到 v1.36', '任何 v1.x 都可以'],
      answer: 1,
      explanation: 'kubectl 可比 kube-apiserver 舊或新一個 minor version；為了讓輸出接近教材，本站建議使用 v1.35 或 v1.36。',
    },
  },
  {
    id: 'container-basics',
    number: 1,
    phase: 'Docker',
    title: 'Container 不是輕量版 VM',
    shortTitle: '容器核心概念',
    duration: '55 分鐘',
    level: '入門',
    summary: '從 process、隔離與生命週期出發，建立 Image、Container、Registry 三者之間的正確心智模型。',
    objectives: ['分辨 Image 與 Container', '理解容器與 VM 的差異', '管理第一個 Nginx 容器'],
    concepts: [
      {
        title: 'Image 是模板，Container 是執行個體',
        body: 'Image 是唯讀、可版本化的檔案系統與啟動設定；Container 則是依 Image 建立的隔離 process。同一個 Image 可以同時啟動多個彼此獨立的 Container。',
      },
      {
        title: '隔離不等於一台完整電腦',
        body: 'Container 與主機共享 kernel，利用 namespace 隔離程序、網路與掛載點，再透過 cgroups 管理資源。VM 通常包含自己的完整作業系統與 kernel。',
      },
    ],
    flow: ['Registry', 'Image', 'Container'],
    lab: {
      title: 'Lab 01 — 啟動第一個 Web Container',
      intro: '下載 Nginx Image、啟動背景容器，將主機的 8080 port 對應到容器的 80 port。',
      steps: ['從 Registry 拉取 nginx:alpine。', '以明確名稱與 port mapping 啟動。', '查看 log 後停止並移除容器。'],
      commands: [
        { label: '執行與觀察', language: 'bash', code: 'docker pull nginx:alpine\ndocker run --name web-lab -d -p 8080:80 nginx:alpine\ndocker ps\ndocker logs web-lab' },
        { label: '清理', language: 'bash', code: 'docker stop web-lab\ndocker rm web-lab' },
      ],
      success: ['瀏覽 http://localhost:8080 可看到 Nginx 頁面', 'docker ps 可看到 0.0.0.0:8080->80/tcp'],
    },
    pitfalls: [
      { title: 'Port is already allocated', fix: '把左側主機 port 改成其他未使用的值，例如 -p 8081:80。' },
      { title: '刪除 Image 失敗', fix: '先移除仍引用該 Image 的 Container；必要時用 docker ps -a 找出已停止容器。' },
    ],
    quiz: {
      question: '執行 docker run nginx:alpine 之後，實際建立的是什麼？',
      options: ['新的 Registry', '新的 Image layer', '由 Image 建立的 Container', '新的 VM'],
      answer: 2,
      explanation: 'docker run 會在需要時先拉取 Image，再依 Image 建立並啟動一個 Container。',
    },
  },
  {
    id: 'dockerfile',
    number: 2,
    phase: 'Docker',
    title: '建立你的第一個 Image',
    shortTitle: 'Dockerfile 與 Image',
    duration: '40 分鐘',
    level: '核心',
    summary: '為簡單的 Web 服務撰寫可重現的 Dockerfile，理解 layer、build context 與 cache 如何影響建置結果。',
    objectives: ['讀懂 Dockerfile 指令', '建立並標記自有 Image', '善用 layer cache'],
    concepts: [
      {
        title: 'Dockerfile 是可重現的建置配方',
        body: '每一條 FROM、COPY、RUN 都描述 Image 的一部分。只要來源檔案與版本固定，團隊成員和 CI 就能建出相同結果，而不是依賴某一台手動設定的機器。',
      },
      {
        title: '把穩定的步驟放前面',
        body: 'Docker 從上往下檢查 cache。把穩定的系統設定與依賴步驟放前面，常變動的應用內容放後面，可以減少不必要的重建時間。',
      },
    ],
    flow: ['Dockerfile', 'docker build', 'Tagged image'],
    lab: {
      title: 'Lab 02 — 建立自訂 Nginx Image',
      intro: '用一個簡單的靜態服務掌握 FROM、COPY、build context、tag 與 Container 驗證流程。',
      steps: ['在 site/ 目錄準備一個 index.html。', '建立 Dockerfile，將內容複製到 Nginx 文件目錄。', '以目前目錄作為 build context 並啟動驗證。'],
      commands: [
        { label: 'Dockerfile', language: 'dockerfile', code: 'FROM nginx:1.27-alpine\nCOPY site/ /usr/share/nginx/html/\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]' },
        { label: '建置與執行', language: 'bash', code: 'docker build -t web-service:v1 .\ndocker image ls web-service\ndocker run --rm --name web-service -p 8080:80 web-service:v1' },
      ],
      success: ['docker image ls 顯示 web-service 與 v1 tag', '瀏覽 http://localhost:8080 能看到自訂內容'],
    },
    note: '不要把 node_modules、dist、.git 或本機祕密送進 build context；應使用 .dockerignore 排除。',
    pitfalls: [
      { title: 'COPY 找不到檔案', fix: 'COPY 的來源相對於 build context，不是 Dockerfile 所在位置。確認 docker build 最後的路徑。' },
      { title: '修改內容後仍看到舊版本', fix: '以新的 tag 重建並重新建立 Container；確認啟動時使用的是剛建好的 Image。' },
    ],
    quiz: {
      question: 'docker build -t web-service:v1 . 最後面的「.」代表什麼？',
      options: ['Image tag', '目前目錄作為 build context', 'Container 名稱', '公開的 port'],
      answer: 1,
      explanation: '最後的路徑是 build context；Dockerfile 的 COPY 來源只能取自這個範圍。',
    },
  },
  {
    id: 'production-image',
    number: 3,
    phase: 'Docker',
    title: '打造 Production Image',
    shortTitle: '多階段建置',
    duration: '35 分鐘',
    level: '實戰',
    summary: '使用 multi-stage build 把建置工具留在 builder，只將 dist 靜態檔案交給 Nginx 執行。',
    objectives: ['實作 multi-stage build', '縮小 runtime attack surface', '加入容器健康檢查'],
    concepts: [
      {
        title: '建置環境與執行環境應該分開',
        body: '許多應用需要編譯器、套件管理器或測試工具才能產生執行產物，但 production runtime 通常不需要攜帶完整工具鏈與原始碼。',
      },
      {
        title: 'Image 越精簡，維運面越清楚',
        body: '更少的套件通常代表更小的下載量與更少的漏洞來源。精簡不是唯一安全策略，仍應固定版本、定期重建並掃描依賴。',
      },
    ],
    flow: ['Node builder', 'dist/', 'Nginx runtime'],
    lab: {
      title: 'Lab 03 — Multi-stage Production Image',
      intro: '第一階段使用 Node 工具鏈產生靜態產物，第二階段只複製 dist 並交由 Nginx 提供服務；重點是階段分工，不要求特定前端框架。',
      steps: ['建立命名為 build 的 builder stage。', '從 build stage 複製 /app/dist。', '比較 dev 與 production Image 的大小。'],
      commands: [
        { label: 'Production Dockerfile', language: 'dockerfile', code: 'FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:1.27-alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]' },
        { label: '建置與驗證', language: 'bash', code: 'docker build -t container-lab:1.0.0 .\ndocker run --rm -d --name container-lab -p 8080:80 container-lab:1.0.0\ndocker inspect container-lab --format "{{.State.Status}}"' },
      ],
      success: ['Production Image 不含 node_modules 與 TypeScript 原始碼', '容器啟動後 http://localhost:8080 可正常開啟'],
    },
    pitfalls: [
      { title: '首頁可開但靜態資源 404', fix: '檢查產物內的資源路徑、Nginx root 與 COPY 目的地是否一致。' },
      { title: '只使用 latest tag', fix: '加入語意版本或 commit SHA，讓每次部署都有可追蹤且可回復的版本。' },
    ],
    quiz: {
      question: 'Multi-stage build 最主要的價值是什麼？',
      options: ['讓 Container 變成 VM', '把建置工具與 runtime 產物分離', '自動建立 Kubernetes', '取消 Image layer'],
      answer: 1,
      explanation: '建置可以使用完整工具鏈，最終 Image 只保留真正執行應用程式所需的內容。',
    },
  },
  {
    id: 'compose',
    number: 4,
    phase: 'Docker',
    title: '用 Compose 組合多個服務',
    shortTitle: 'Compose 與資料',
    duration: '60 分鐘',
    level: '核心',
    summary: '把 Web、API 與資料庫寫成一份可版本控制的應用拓樸，理解 service network、volume 與健康相依。',
    objectives: ['撰寫 compose.yaml', '理解 service name DNS', '正確保存資料庫資料'],
    concepts: [
      {
        title: 'Compose 描述的是一個應用',
        body: '比起手動執行多條 docker run，Compose 將服務、網路、儲存與設定集中在 YAML，團隊可用同一份檔案啟動一致的開發環境。',
      },
      {
        title: '容器間不要使用 localhost 找彼此',
        body: '每個 Container 都有自己的網路空間。Compose 會建立預設網路，服務可以透過 service name，例如 db:5432，互相解析與連線。',
      },
    ],
    flow: ['Frontend', 'API service', 'Database volume'],
    lab: {
      title: 'Lab 04 — 啟動 Web 與 Redis',
      intro: '用 Compose 啟動兩個服務，觀察服務名稱如何成為內部 DNS，以及 volume 如何保留資料。',
      steps: ['建立 compose.yaml。', '背景啟動整組服務並查看狀態。', '檢查 log，最後移除服務但保留或刪除 volume。'],
      commands: [
        { label: 'compose.yaml', language: 'yaml', code: 'services:\n  web:\n    image: container-lab:1.0.0\n    ports:\n      - "8080:80"\n    depends_on:\n      redis:\n        condition: service_healthy\n  redis:\n    image: redis:7-alpine\n    volumes:\n      - redis-data:/data\n    healthcheck:\n      test: ["CMD", "redis-cli", "ping"]\n      interval: 5s\n      timeout: 3s\n      retries: 5\nvolumes:\n  redis-data:' },
        { label: 'Compose 生命週期', language: 'bash', code: 'docker compose up -d\ndocker compose ps\ndocker compose logs -f --tail=50\ndocker compose down\n# 連 volume 一起移除：docker compose down -v' },
      ],
      success: ['docker compose ps 顯示 web 與 redis', '重建 Container 後，named volume 仍然存在'],
    },
    pitfalls: [
      { title: 'depends_on 等於服務可用？', fix: '單純啟動順序不代表服務已可接受連線；搭配 healthcheck 與 condition。' },
      { title: '誤刪資料', fix: 'docker compose down -v 會連 named volume 一起刪除，執行前先確認資料是否可重建。' },
    ],
    quiz: {
      question: 'API Container 要連到名為 db 的資料庫服務，host 通常應填什麼？',
      options: ['localhost', '127.0.0.1', 'db', '主機的公開 IP'],
      answer: 2,
      explanation: '在 Compose 預設網路中，service name 會成為可解析的 DNS 名稱。',
    },
  },
  {
    id: 'k8s-map',
    number: 5,
    phase: 'Kubernetes',
    title: '讀懂 Kubernetes 地圖',
    shortTitle: '叢集與宣告式管理',
    duration: '55 分鐘',
    level: '入門',
    summary: '認識 Cluster、Control Plane、Node 與 reconciliation，理解為何 Kubernetes 管理的是期望狀態。',
    objectives: ['說明 control plane 與 node 分工', '讀懂 Kubernetes manifest', '理解宣告式管理'],
    concepts: [
      {
        title: '你描述結果，Controller 負責追上',
        body: 'Kubernetes manifest 宣告「我希望有三個副本」，Controller 持續比較實際狀態與期望狀態，並建立或替換資源。這個循環稱為 reconciliation。',
      },
      {
        title: 'API Server 是一致的入口',
        body: 'kubectl、Controller 與其他工具都透過 API Server 讀寫資源。Scheduler 決定 Pod 到哪個 Node，Node 上的 kubelet 再確保 Container 實際執行。',
      },
    ],
    flow: ['kubectl', 'API Server', 'Node / kubelet'],
    lab: {
      title: 'Lab 05 — 探索你的 Cluster',
      intro: '這一課先不部署應用，專注讀取叢集提供的資訊與 API 資源。',
      steps: ['查看 cluster-info 與節點。', '列出所有 namespace。', '查看 Deployment 資源的說明。'],
      commands: [
        { label: '探索叢集', language: 'bash', code: 'kubectl cluster-info\nkubectl get nodes -o wide\nkubectl get namespaces\nkubectl api-resources' },
        { label: '向 API 查文件', language: 'bash', code: 'kubectl explain deployment\nkubectl explain deployment.spec\nkubectl explain deployment.spec.template.spec.containers' },
      ],
      success: ['知道目前 kubectl 操作的是哪個 cluster', '能用 kubectl explain 找到欄位用途'],
    },
    pitfalls: [
      { title: '在錯的 Cluster 操作', fix: '執行變更前先看 kubectl config current-context；重要環境可在 shell prompt 顯示 context。' },
      { title: '只背 YAML', fix: '用 kubectl explain 從 API schema 理解欄位，不必靠複製未知來源的 manifest。' },
    ],
    quiz: {
      question: '哪個元件負責選擇 Pod 應該放到哪個 Node？',
      options: ['kubelet', 'Scheduler', 'Container registry', 'Service'],
      answer: 1,
      explanation: 'Scheduler 依資源需求與排程條件選擇 Node；kubelet 負責在被選中的 Node 上執行 Pod。',
    },
  },
  {
    id: 'deploy',
    number: 6,
    phase: 'Kubernetes',
    title: 'Deployment 管理你的 Pod',
    shortTitle: 'Pod 與 Deployment',
    duration: '45 分鐘',
    level: '核心',
    summary: '不要手動照顧單一 Pod；使用 Deployment 管理副本、版本與失敗後的自動重建。',
    objectives: ['建立 Deployment manifest', '理解 label 與 selector', '觀察 Pod 自我修復'],
    concepts: [
      {
        title: 'Pod 是最小排程單位，也是短暫的',
        body: 'Pod 可以包含一個或多個共享網路與 volume 的 Container。Pod 被替換後會有新的名稱與 IP，因此不應把它當成長期固定的主機。',
      },
      {
        title: 'Deployment 管理版本與副本',
        body: 'Deployment 建立 ReplicaSet，再由 ReplicaSet 維持指定數量的 Pod。刪掉其中一個 Pod，Controller 會建立新的補回期望副本數。',
      },
    ],
    flow: ['Deployment', 'ReplicaSet', 'Pods × 2'],
    lab: {
      title: 'Lab 06 — 部署 Container Lab',
      intro: '建立兩個 Nginx Pod，透過 labels 將 Deployment、ReplicaSet 與 Pod 關聯起來。',
      steps: ['儲存 deployment.yaml 並 apply。', '等待 rollout 完成。', '刪除一個 Pod，觀察新的 Pod 被建立。'],
      commands: [
        { label: 'deployment.yaml', language: 'yaml', code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: container-lab\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: container-lab\n  template:\n    metadata:\n      labels:\n        app: container-lab\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27-alpine\n          ports:\n            - containerPort: 80' },
        { label: '部署與觀察', language: 'bash', code: 'kubectl apply -f deployment.yaml\nkubectl rollout status deployment/container-lab\nkubectl get deploy,rs,pods -l app=container-lab\nkubectl delete pod <POD_NAME>' },
      ],
      success: ['Deployment 顯示 2/2 ready', '刪除 Pod 後很快又回到兩個 Pod'],
    },
    pitfalls: [
      { title: 'selector 與 labels 不一致', fix: 'spec.selector.matchLabels 必須能匹配 template.metadata.labels，且建立後 selector 不可任意更改。' },
      { title: '直接修改 Pod', fix: '修改 Deployment 的 Pod template，讓 Controller 用新的宣告產生 Pod。' },
    ],
    quiz: {
      question: '手動刪除 Deployment 管理的一個 Pod 後，通常會發生什麼？',
      options: ['Deployment 一起消失', 'Service 停止', 'Controller 建立新 Pod 補足副本', '整個 Node 重啟'],
      answer: 2,
      explanation: 'ReplicaSet 會持續維持 Deployment 指定的 replicas 數量。',
    },
  },
  {
    id: 'service',
    number: 7,
    phase: 'Kubernetes',
    title: '用 Service 找到會變動的 Pod',
    shortTitle: 'Service 與網路',
    duration: '40 分鐘',
    level: '核心',
    summary: '透過穩定的 Service 名稱與虛擬 IP，把流量導向符合 selector 且 Ready 的 Pod。',
    objectives: ['建立 ClusterIP Service', '理解 selector 與 Endpoint', '比較常見 Service 類型'],
    concepts: [
      {
        title: 'Pod IP 會變，Service 身分保持穩定',
        body: 'Deployment 更新或修復時會產生新 Pod。Service 依 label selector 找出後端 Pod，提供穩定 DNS 與連線入口，呼叫端不用追蹤每個 Pod IP。',
      },
      {
        title: '先分清楚內部與外部流量',
        body: 'ClusterIP 適合叢集內通訊；NodePort 暴露每個 Node 的固定 port；LoadBalancer 通常由雲端整合提供外部位址；Ingress 則在 HTTP 層集中管理路由。',
      },
    ],
    flow: ['Client', 'Service :80', 'Ready Pods'],
    lab: {
      title: 'Lab 07 — 公開 Web 服務',
      intro: '建立 ClusterIP Service，再用 port-forward 從本機安全地驗證服務，不依賴雲端 Load Balancer。',
      steps: ['建立與 Deployment label 相符的 Service。', '檢查 EndpointSlice 是否包含 Pod 位址。', '建立本機 port-forward。'],
      commands: [
        { label: 'service.yaml', language: 'yaml', code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: container-lab\nspec:\n  selector:\n    app: container-lab\n  ports:\n    - name: http\n      port: 80\n      targetPort: 80\n  type: ClusterIP' },
        { label: '套用與連線', language: 'bash', code: 'kubectl apply -f service.yaml\nkubectl get service,endpointslice\nkubectl port-forward service/container-lab 8080:80' },
      ],
      success: ['EndpointSlice 顯示兩個 ready endpoint', 'http://localhost:8080 可以開啟 Nginx'],
    },
    pitfalls: [
      { title: 'Service 沒有 Endpoint', fix: '比較 Service selector 與 Pod labels，並檢查 Pod readiness。' },
      { title: 'port 與 targetPort 混淆', fix: 'port 是 Service 接收流量的 port；targetPort 是 Pod Container 實際監聽的 port。' },
    ],
    quiz: {
      question: 'Service 通常用什麼機制選出後端 Pod？',
      options: ['Pod 名稱前綴', '建立時間', 'Label selector', 'Container log'],
      answer: 2,
      explanation: 'Service selector 會匹配 Pod labels，並形成對應的 EndpointSlice。',
    },
  },
  {
    id: 'configuration',
    number: 8,
    phase: 'Kubernetes',
    title: '把設定與程式碼分開',
    shortTitle: 'ConfigMap、Secret、儲存',
    duration: '45 分鐘',
    level: '核心',
    summary: '使用 ConfigMap 與 Secret 注入環境差異，理解 Volume 與 PersistentVolumeClaim 解決的是不同生命週期。',
    objectives: ['建立 ConfigMap 與 Secret', '以 env 或 volume 注入設定', '理解持久化儲存邊界'],
    concepts: [
      {
        title: 'Image 應該能跨環境使用',
        body: '資料庫位址、功能開關與部署環境不應烘焙進 Image。ConfigMap 適合一般設定；Secret 用於敏感資料，但 base64 只是編碼，仍需要 RBAC、加密與外部祕密管理。',
      },
      {
        title: 'Container filesystem 不是資料庫備份',
        body: 'Pod 被替換時其可寫層會消失。需要跨 Pod 保留的資料應放在 PersistentVolume，並透過 PersistentVolumeClaim 表達容量與存取需求。',
      },
    ],
    flow: ['ConfigMap / Secret', 'Pod spec', 'App process'],
    lab: {
      title: 'Lab 08 — 注入環境設定',
      intro: '建立設定並由 Deployment 引用，最後確認變數已出現在 Container 環境中。',
      steps: ['以 manifest 建立 ConfigMap。', '讓 Deployment 使用 envFrom。', '重新部署並從 Container 內驗證。'],
      commands: [
        { label: 'config.yaml', language: 'yaml', code: 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: container-lab-config\ndata:\n  APP_ENV: "practice"\n  API_BASE_URL: "http://api.default.svc.cluster.local"\n---\napiVersion: v1\nkind: Secret\nmetadata:\n  name: container-lab-secret\ntype: Opaque\nstringData:\n  DEMO_TOKEN: "replace-me"' },
        { label: 'Deployment 引用片段', language: 'yaml', code: 'envFrom:\n  - configMapRef:\n      name: container-lab-config\n  - secretRef:\n      name: container-lab-secret' },
        { label: '驗證', language: 'bash', code: 'kubectl apply -f config.yaml\nkubectl exec deploy/container-lab -- printenv APP_ENV' },
      ],
      success: ['Container 內 APP_ENV 顯示 practice', 'Git repository 沒有提交真實 token 或密碼'],
    },
    note: '課程中的 Secret 只放示範值。真實憑證不要提交到 Git，也不要只依靠 base64 保護。',
    pitfalls: [
      { title: '更新 ConfigMap 後 App 沒變', fix: '環境變數只在 Container 啟動時注入；更新後需觸發 rollout。Volume 掛載的更新行為則不同。' },
      { title: '把 Secret YAML 提交 Git', fix: '使用外部 Secret 管理、SOPS 或 CI 注入，並限制 ServiceAccount 的存取權限。' },
    ],
    quiz: {
      question: '關於 Kubernetes Secret，下列何者正確？',
      options: ['base64 等於加密', '可以安全提交任何密碼', '仍需搭配權限與加密管理', '只能掛載成檔案'],
      answer: 2,
      explanation: 'Secret 預設常以 base64 表示資料，並不等同加密；還需 RBAC、etcd encryption 等保護。',
    },
  },
  {
    id: 'release',
    number: 9,
    phase: 'Kubernetes',
    title: '安全地擴展與更新',
    shortTitle: 'Scale、Probe、Rollout',
    duration: '50 分鐘',
    level: '實戰',
    summary: '透過 requests、limits、health probes 與 rolling update，讓擴展和版本發布變成可觀察、可回復的流程。',
    objectives: ['設定健康檢查與資源需求', '執行 rolling update', '在異常時 rollback'],
    concepts: [
      {
        title: 'Running 不代表能接流量',
        body: 'Readiness probe 決定 Pod 是否加入 Service endpoints；liveness probe 用於處理無法自行恢復的卡死；startup probe 則保護啟動較慢的應用，避免過早重啟。',
      },
      {
        title: '資源宣告讓排程有依據',
        body: 'requests 是排程時保留的資源基準，limits 是容器可使用的上限。未設定可能造成資源競爭；設定失真則可能 Pending、被節流或 OOMKilled。',
      },
    ],
    flow: ['New ReplicaSet', 'Readiness check', 'Old ReplicaSet ↓'],
    lab: {
      title: 'Lab 09 — 發布、觀察、回復',
      intro: '為 Deployment 加入 probe 與 resources，更新 Image，刻意觀察 rollout，再練習回復上一版。',
      steps: ['更新 Pod template 的健康檢查與資源。', '變更 Image tag 並觀察 rollout。', '查看歷史並執行 rollback。'],
      commands: [
        { label: 'Container 設定片段', language: 'yaml', code: 'resources:\n  requests:\n    cpu: 50m\n    memory: 32Mi\n  limits:\n    cpu: 200m\n    memory: 128Mi\nreadinessProbe:\n  httpGet:\n    path: /\n    port: 80\n  initialDelaySeconds: 2\n  periodSeconds: 5\nlivenessProbe:\n  httpGet:\n    path: /\n    port: 80\n  initialDelaySeconds: 10\n  periodSeconds: 10' },
        { label: '更新與回復', language: 'bash', code: 'kubectl set image deployment/container-lab web=nginx:1.27.4-alpine\nkubectl rollout status deployment/container-lab\nkubectl rollout history deployment/container-lab\nkubectl rollout undo deployment/container-lab' },
      ],
      success: ['Rollout 過程中服務仍可連線', 'kubectl rollout history 至少有兩個 revision'],
    },
    pitfalls: [
      { title: 'Liveness probe 太積極', fix: '先量測正常啟動與尖峰延遲；錯誤設定會造成原本健康的 Container 重啟循環。' },
      { title: '使用可變的 latest', fix: '部署不可變 tag 或 digest，確保 rollout history 對應到明確產物。' },
    ],
    quiz: {
      question: '哪一種 probe 決定 Pod 是否應接收 Service 流量？',
      options: ['Readiness probe', 'Liveness probe', 'Startup command', 'Resource limit'],
      answer: 0,
      explanation: 'Readiness probe 失敗時 Pod 仍可運行，但會從 Service endpoints 移除。',
    },
  },
  {
    id: 'debug-capstone',
    number: 10,
    phase: 'Kubernetes',
    title: '除錯並完成最終專題',
    shortTitle: '除錯與 Capstone',
    duration: '60 分鐘',
    level: '實戰',
    summary: '建立一套從現象到證據的除錯順序，最後把 Docker 與 Kubernetes 能力收斂成可驗收的部署。',
    objectives: ['使用 get、describe、logs 與 events', '判斷常見 Pod 異常', '完成可重現的端到端部署'],
    concepts: [
      {
        title: '先縮小範圍，再猜原因',
        body: '從整體狀態開始：資源存在嗎、Ready 嗎、事件說了什麼、Container 有 log 嗎？固定順序能避免一開始就進 Container 裡盲目翻找。',
      },
      {
        title: '一份好的部署應該可重建',
        body: '最終成果不只是「我的電腦上跑起來」。其他人應能從 repository 的 Dockerfile、manifests 與 README 重建相同 Image、部署相同資源並依明確步驟驗證。',
      },
    ],
    flow: ['Observe', 'Narrow down', 'Fix & verify'],
    lab: {
      title: 'Capstone — Container Lab 上線',
      intro: '將一個示範 Web 服務容器化並部署到本機 Kubernetes，完成擴展、更新、故障診斷與回復。',
      steps: ['建置帶有版本 tag 的 multi-stage Image。', '部署 Deployment、Service、ConfigMap、probes 與 resources。', '擴展至三個 replicas，發布新版後 rollback。', '在 README 記錄架構、指令、驗證方式與已知限制。'],
      commands: [
        { label: '系統化觀察', language: 'bash', code: 'kubectl get pods -o wide\nkubectl describe pod <POD_NAME>\nkubectl logs <POD_NAME> --previous\nkubectl get events --sort-by=.metadata.creationTimestamp' },
        { label: '驗收指令', language: 'bash', code: 'kubectl get deploy,svc,pods -l app=container-lab\nkubectl scale deployment/container-lab --replicas=3\nkubectl rollout status deployment/container-lab\nkubectl port-forward service/container-lab 8080:80' },
      ],
      success: ['三個 Pod 全部 Ready 並由 Service 提供流量', 'README 足以讓另一位學員從零重現部署', '能展示 rollout history 與一次 rollback'],
    },
    note: '完成後將 Dockerfile、manifests 與操作說明一起納入版本控制，確保另一位學員能從零重現。',
    pitfalls: [
      { title: 'CrashLoopBackOff', fix: '查看目前與前一次 Container logs，再用 describe 檢查 command、環境變數、probe 與掛載。' },
      { title: 'ImagePullBackOff', fix: '檢查 Image 名稱與 tag、registry 權限，以及本機 Cluster 是否能看到本機 Image。' },
    ],
    quiz: {
      question: '遇到 CrashLoopBackOff 時，最有價值的第一組證據通常是？',
      options: ['重新安裝 kubectl', 'Pod logs 與 describe events', '立刻刪除 Cluster', '增加 Service port'],
      answer: 1,
      explanation: 'logs 反映應用程式退出原因，describe 與 events 則補充 probe、Image、排程與 Container 狀態。',
    },
  },
]

export const dockerLessons = lessons.filter((lesson) => lesson.phase === 'Docker')
export const kubernetesLessons = lessons.filter((lesson) => lesson.phase === 'Kubernetes')

export function getLesson(id?: string) {
  return lessons.find((lesson) => lesson.id === id)
}

export function getNextLesson(id: string) {
  const index = lessons.findIndex((lesson) => lesson.id === id)
  return index >= 0 ? lessons[index + 1] : undefined
}

export function getPreviousLesson(id: string) {
  const index = lessons.findIndex((lesson) => lesson.id === id)
  return index > 0 ? lessons[index - 1] : undefined
}

import type { CommandBlock } from './curriculum'

export type KnowledgePoint = {
  title: string
  body: string
}

export type KnowledgeDecision = {
  scenario: string
  choose: string
  reason: string
}

export type KnowledgeDomain = {
  id: string
  number: string
  category: 'Container' | 'Docker' | 'Kubernetes' | 'Operations'
  title: string
  summary: string
  mentalModel: string
  points: KnowledgePoint[]
  decisions: KnowledgeDecision[]
  command: CommandBlock
  lessonPath: string
  lessonLabel: string
  source: { label: string; href: string }
}

export const knowledgeDomains: KnowledgeDomain[] = [
  {
    id: 'container-runtime',
    number: '01',
    category: 'Container',
    title: 'Container 從指令到 Linux Process',
    summary: '理解 Docker CLI、Engine、containerd、OCI runtime 與 Linux kernel 如何合作，才知道隔離、資源限制和安全邊界真正發生在哪裡。',
    mentalModel: 'Container 不是一個盒子，而是「被 namespace 隔離、被 cgroup 約束，並看到獨立檔案系統視圖的 Process」。',
    points: [
      { title: 'Namespace 隔離視野', body: 'PID、network、mount、UTS、IPC 與 user namespace 讓 Process 看到不同的程序、網卡、掛載點、主機名稱與使用者映射。' },
      { title: 'cgroup 管理資源', body: 'cgroup 記帳並限制 CPU、memory、PID 與 I/O。容器記憶體超過限制時可能被 OOMKilled，而不是單純「變慢」。' },
      { title: 'OCI 提供共同規格', body: 'OCI Image 與 Runtime Specification 讓不同工具能交換 Image 並啟動相容 bundle；但 CPU 架構、kernel 能力仍會影響可攜性。' },
      { title: 'PID 1 與訊號', body: 'Container 的主程序通常是 PID 1，必須正確處理 SIGTERM、回收 child process，才能在停止或 rollout 時優雅結束。' },
    ],
    decisions: [
      { scenario: '需要檢查隔離後的程序', choose: 'docker top / docker inspect', reason: '先從主機觀察，不必立刻進入 Container 改變現場。' },
      { scenario: '服務持續吃滿記憶體', choose: '設定 memory limit 並觀察 stats', reason: '限制是保護主機，不是解決 memory leak；仍要修正應用程式。' },
      { scenario: '應用無法正常停止', choose: '檢查 ENTRYPOINT、PID 1 與訊號處理', reason: '只延長 stop timeout 可能掩蓋根因。' },
    ],
    command: { label: '觀察 Container 的程序與限制', language: 'bash', code: 'docker inspect web\ndocker top web\ndocker stats web --no-stream\ndocker diff web' },
    lessonPath: '/learn/container-basics',
    lessonLabel: '回到容器核心概念',
    source: { label: 'Docker：What is a container?', href: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/' },
  },
  {
    id: 'image-supply-chain',
    number: '02',
    category: 'Docker',
    title: 'Image、Layer 與軟體供應鏈',
    summary: 'Image 不只是壓縮檔；它是可尋址的 layers、設定與 metadata。建置方式直接影響速度、重現性、漏洞數量與稽核能力。',
    mentalModel: 'Tag 是方便人閱讀的指標，可能被移動；Digest 是內容地址，代表一份確切產物。',
    points: [
      { title: 'Build context 決定輸入', body: '.dockerignore 可避免把 node_modules、祕密與無關檔案送進 builder，也讓 cache key 更穩定。' },
      { title: 'Layer 與 cache', body: 'Dockerfile 指令形成可重用 layer。先複製 lockfile 安裝依賴，再複製常變程式碼，通常能提高 cache 命中率。' },
      { title: 'Multi-stage 分離責任', body: 'builder 可以含 compiler 與測試工具，runtime stage 只保留執行所需檔案，縮小下載量與 attack surface。' },
      { title: '持續重建而非永久不動', body: 'Digest pinning 提供重現性，但也要有自動化更新、SBOM、掃描與重新建置流程，才能取得安全修補。' },
    ],
    decisions: [
      { scenario: '開發環境快速迭代', choose: '明確 major/minor tag', reason: '保留可讀性並接受受控更新。' },
      { scenario: '正式發布與稽核', choose: 'Tag + Digest', reason: '兼顧人類辨識、內容不可變與追蹤。' },
      { scenario: '建置需要私有 token', choose: 'BuildKit secret mount', reason: '不要用 ARG、ENV 或 COPY 把祕密寫進 layer。' },
    ],
    command: { label: '檢查 Image 結構與來源', language: 'bash', code: 'docker image inspect app:1.0\ndocker history --no-trunc app:1.0\ndocker build --pull -t app:1.0 .\ndocker image ls --digests' },
    lessonPath: '/learn/dockerfile',
    lessonLabel: '回到 Dockerfile 與 Image',
    source: { label: 'Docker：Building best practices', href: 'https://docs.docker.com/build/building/best-practices/' },
  },
  {
    id: 'compose-model',
    number: '03',
    category: 'Docker',
    title: 'Compose 的應用模型與邊界',
    summary: 'Compose 把 services、networks、volumes、configs 與 secrets 組成一個 project，適合重現多服務開發環境與整合測試。',
    mentalModel: 'Compose 描述的是一組服務如何合作，不是把多條 docker run 指令換成 YAML 而已。',
    points: [
      { title: 'Service 是可複製模板', body: 'Service 定義 Image、build、command、environment、ports 與 mounts；實際執行的是依此建立的 Container。' },
      { title: '名稱就是服務發現', body: '同一 project 的服務預設加入共同 network，可用 service name 解析，不應把其他 Container 寫死為 localhost。' },
      { title: '啟動順序不等於就緒', body: 'depends_on 能表達相依，但應搭配 healthcheck 與應用重試；資料庫程序啟動不代表已可接受查詢。' },
      { title: '開發與正式環境邊界', body: 'Compose 很適合單機與 CI；跨節點排程、自我修復、RBAC 與漸進發布通常需要 Kubernetes 或其他編排平台。' },
    ],
    decisions: [
      { scenario: '原始碼即時掛載', choose: 'Bind mount', reason: '主機檔案變更能立即反映，適合開發。' },
      { scenario: '資料庫資料保存', choose: 'Named volume', reason: '生命週期獨立於 Container，路徑由 Docker 管理。' },
      { scenario: '選配除錯工具', choose: 'Profiles / override file', reason: '核心拓樸不必為每位開發者複製一份。' },
    ],
    command: { label: '先展開設定，再啟動與觀察', language: 'bash', code: 'docker compose config\ndocker compose up -d --build --wait\ndocker compose ps\ndocker compose logs -f --tail=100' },
    lessonPath: '/learn/compose',
    lessonLabel: '回到 Compose 與資料',
    source: { label: 'Docker：Compose application model', href: 'https://docs.docker.com/compose/intro/compose-application-model/' },
  },
  {
    id: 'cluster-control-loop',
    number: '04',
    category: 'Kubernetes',
    title: 'Kubernetes 元件與控制迴圈',
    summary: 'API Server 是入口，etcd 保存狀態，Scheduler 選 Node，Controller 持續調和，kubelet 最後在 Node 上落實 Pod。',
    mentalModel: '你提交的不是一串操作步驟，而是一份期望狀態；Controller 會持續縮小 spec 與 status 的差距。',
    points: [
      { title: 'API Server 是系統邊界', body: 'kubectl、Controller、Scheduler 與外部自動化都透過 API 讀寫物件，驗證、授權與 admission 也在這條路徑發生。' },
      { title: 'etcd 保存叢集真相', body: 'etcd 保存 Kubernetes API 資料。它不是一般應用資料庫；備份、加密與災難復原是叢集管理責任。' },
      { title: 'Scheduler 只做放置決策', body: 'Scheduler 根據 requests、限制條件、親和性、taints 與可用資源挑選 Node，不負責啟動 Container。' },
      { title: 'kubelet 管理本機 Pod', body: 'kubelet 取得 PodSpec，透過 CRI 與 container runtime 建立 Container，回報狀態並執行 probes。' },
    ],
    decisions: [
      { scenario: '欄位不知道怎麼填', choose: 'kubectl explain', reason: '直接查目前 Cluster 的 API schema。' },
      { scenario: '物件已 apply 但未生效', choose: '先比較 spec、status、conditions、events', reason: '控制迴圈通常會留下無法調和的證據。' },
      { scenario: '要自動化管理新資源', choose: 'CRD + Controller / Operator', reason: '把領域知識寫進 reconciliation，而非堆疊 shell script。' },
    ],
    command: { label: '查看 API 與 Control Plane 證據', language: 'bash', code: 'kubectl cluster-info\nkubectl api-resources\nkubectl get --raw=/readyz?verbose\nkubectl get events -A --sort-by=.metadata.creationTimestamp' },
    lessonPath: '/learn/k8s-map',
    lessonLabel: '回到叢集與宣告式管理',
    source: { label: 'Kubernetes：Cluster components', href: 'https://kubernetes.io/docs/concepts/overview/components/' },
  },
  {
    id: 'workload-selection',
    number: '05',
    category: 'Kubernetes',
    title: 'Pod 與工作負載選型',
    summary: 'Pod 是排程與共同生命週期的最小單位；日常通常由 Deployment、StatefulSet、DaemonSet、Job 或 CronJob 管理 Pod。',
    mentalModel: '不要問「如何讓這個 Pod 永遠不死」，而要問「哪個 Controller 能在 Pod 消失後恢復正確狀態」。',
    points: [
      { title: 'Deployment 管理無狀態副本', body: 'Pod 可互換、可水平擴展，並需要 rolling update 與 rollback 時，使用 Deployment。' },
      { title: 'StatefulSet 保留身分', body: '需要穩定網路名稱、有序更新或每個副本自己的 PVC 時使用；它不會自動解決資料複寫與一致性。' },
      { title: 'DaemonSet 跟著 Node', body: '每個符合條件的 Node 都需要一份 agent，例如 log collector、監控或 CNI 元件時使用。' },
      { title: 'Job 處理完成型任務', body: 'Job 執行到成功完成；CronJob 依排程建立 Job。需設計冪等、重試、concurrencyPolicy 與歷史保留。' },
    ],
    decisions: [
      { scenario: 'HTTP API，可任意替換副本', choose: 'Deployment', reason: '無狀態服務的標準選擇。' },
      { scenario: '資料庫或有序叢集成員', choose: 'StatefulSet', reason: '需要穩定 identity 與 storage；仍應優先評估成熟 Operator。' },
      { scenario: '每天凌晨產生報表', choose: 'CronJob', reason: '任務會完成，不需要常駐 Service。' },
    ],
    command: { label: '一次查看不同工作負載', language: 'bash', code: 'kubectl get deploy,statefulset,daemonset\nkubectl get jobs,cronjobs\nkubectl get pods -o wide\nkubectl describe deploy/container-lab' },
    lessonPath: '/learn/deploy',
    lessonLabel: '回到 Pod 與 Deployment',
    source: { label: 'Kubernetes：Workloads', href: 'https://kubernetes.io/docs/concepts/workloads/' },
  },
  {
    id: 'networking',
    number: '06',
    category: 'Kubernetes',
    title: 'Pod 網路、Service 與流量入口',
    summary: 'CNI 提供 Pod 網路，Service 透過 selector 與 EndpointSlice 建立穩定入口，DNS 提供名稱；Ingress 或 Gateway API 再承接叢集外流量。',
    mentalModel: 'Pod IP 是實例位址，Service 是長期服務身分；先確認 Endpoint，再檢查 DNS、port 與網路政策。',
    points: [
      { title: '每個 Pod 有自己的網路空間', body: '同一 Pod 內的 Container 共用 IP 與 localhost；不同 Pod 透過叢集網路直接通訊。' },
      { title: 'Service 不等於 Proxy Process', body: 'Service 是 API 物件；資料平面可能由 kube-proxy、eBPF 或雲端實作把流量送到 Ready endpoints。' },
      { title: '入口分成 L4 與 L7', body: 'LoadBalancer Service 提供較直接的 L4 暴露；Ingress 與 Gateway API 依 hostname、path、TLS 等 L7 規則路由。' },
      { title: 'NetworkPolicy 需要實作者', body: 'API 物件存在不代表一定生效；CNI 必須支援並啟用 NetworkPolicy。預設開放環境應逐步改成最小允許。' },
    ],
    decisions: [
      { scenario: '只給叢集內服務使用', choose: 'ClusterIP', reason: '提供穩定 DNS/IP，不額外暴露外部入口。' },
      { scenario: '多個 HTTP 服務共用網域', choose: 'Gateway API 或 Ingress', reason: '集中 TLS、host 與 path routing。' },
      { scenario: '限制 API 只能被 Web 存取', choose: 'NetworkPolicy', reason: '用 label 表達 L3/L4 允許規則，並確認 CNI 支援。' },
    ],
    command: { label: '由 Service 一路追到 Pod', language: 'bash', code: 'kubectl get svc,endpointslice\nkubectl describe svc/container-lab\nkubectl get pods -l app=container-lab --show-labels\nkubectl get networkpolicy -A' },
    lessonPath: '/learn/service',
    lessonLabel: '回到 Service 與網路',
    source: { label: 'Kubernetes：Services and networking', href: 'https://kubernetes.io/docs/concepts/services-networking/' },
  },
  {
    id: 'configuration-storage',
    number: '07',
    category: 'Kubernetes',
    title: '設定、Secret 與持久化儲存',
    summary: 'ConfigMap 與 Secret 把環境差異移出 Image；Volume 解決 Pod 內資料使用，PV、PVC、StorageClass 與 CSI 則處理持久化供應。',
    mentalModel: 'Image 是可跨環境的程式；設定與憑證在部署時注入；重要資料的生命週期必須長於 Pod。',
    points: [
      { title: 'env 與 volume 更新行為不同', body: '環境變數只在 Container 啟動時注入；ConfigMap/Secret volume 可更新檔案，但應用是否重新載入仍由程式決定。' },
      { title: 'Secret 不是加密保證', body: 'base64 只是編碼。仍要限制 RBAC、啟用 at-rest encryption、避免輸出到 log，並考慮外部 secret manager。' },
      { title: 'PVC 是對儲存的需求', body: 'PVC 描述容量、access mode 與 StorageClass；控制器可透過 CSI 動態建立 PV，再綁定給 Pod。' },
      { title: '持久化不等於有備份', body: 'PV 能跨 Pod 保留資料，但不自動提供跨區備援、應用一致性快照、還原演練或災難復原。' },
    ],
    decisions: [
      { scenario: '非敏感功能開關', choose: 'ConfigMap', reason: '設定可審查並與 Image 分離。' },
      { scenario: '短期 scratch / 同 Pod 共用', choose: 'emptyDir', reason: 'Pod 刪除後可一併消失。' },
      { scenario: '資料需跨 Pod 重建保留', choose: 'PVC + StorageClass', reason: '由叢集儲存系統提供持久 Volume。' },
    ],
    command: { label: '檢查設定與儲存綁定', language: 'bash', code: 'kubectl get configmap,secret\nkubectl get pvc,pv,storageclass\nkubectl describe pvc <PVC_NAME>\nkubectl get pod <POD_NAME> -o yaml' },
    lessonPath: '/learn/configuration',
    lessonLabel: '回到設定與儲存',
    source: { label: 'Kubernetes：Storage', href: 'https://kubernetes.io/docs/concepts/storage/' },
  },
  {
    id: 'reliability',
    number: '08',
    category: 'Kubernetes',
    title: '資源、Probe、排程與可用性',
    summary: '可靠性來自正確的資源需求、健康訊號、分散排程、滾動發布與容量策略，而不是單純把 replicas 改大。',
    mentalModel: 'Scheduler 依 requests 做承諾，runtime 依 limits 做約束，Service 依 readiness 決定是否送流量。',
    points: [
      { title: 'Requests 影響排程', body: 'CPU 與 memory requests 是 Scheduler 的容量依據，也影響 QoS。設太低會過度承諾，設太高則造成資源閒置或 Pending。' },
      { title: '三種 Probe 不可互換', body: 'startup 保護慢啟動、readiness 控制流量、liveness 嘗試重啟卡死程序；錯誤 liveness 會製造重啟風暴。' },
      { title: '副本要跨故障域', body: 'pod anti-affinity 或 topologySpreadConstraints 可避免所有副本落在同一 Node／Zone，PDB 則限制自願性中斷。' },
      { title: 'Autoscaling 需要完整訊號', body: 'HPA 依 metrics 調整副本，Cluster Autoscaler 類工具調整 Node；若 requests 或 metrics 錯誤，自動擴展也會錯誤。' },
    ],
    decisions: [
      { scenario: '應用啟動需要兩分鐘', choose: 'startupProbe', reason: '啟動成功前暫停 liveness/readiness 判斷。' },
      { scenario: '暫時不能接收流量但程序正常', choose: 'readinessProbe', reason: '移出 Service endpoints，不必重啟。' },
      { scenario: '節點維護仍要保留多數副本', choose: 'PDB + 分散排程', reason: '同時處理 eviction 上限與故障域集中風險。' },
    ],
    command: { label: '觀察資源、健康與發布', language: 'bash', code: 'kubectl top pods\nkubectl get pods -o wide\nkubectl get hpa,pdb\nkubectl rollout status deploy/container-lab' },
    lessonPath: '/learn/release',
    lessonLabel: '回到 Scale、Probe 與 Rollout',
    source: { label: 'Kubernetes：Resource management', href: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/' },
  },
  {
    id: 'security',
    number: '09',
    category: 'Kubernetes',
    title: '從 Image 到 Cluster 的分層安全',
    summary: '安全沒有單一開關；需要同時處理供應鏈、API 身分與授權、Pod 權限、網路隔離、Secret、Node 與稽核。',
    mentalModel: '預設拒絕、最小權限、不可變產物與可追溯變更，必須在每一層重複落實。',
    points: [
      { title: 'ServiceAccount 是工作負載身分', body: 'Pod 透過 ServiceAccount 取得 API 身分，再由 RBAC Role/ClusterRole 與 Binding 決定可執行的動作。' },
      { title: 'SecurityContext 降低權限', body: 'runAsNonRoot、allowPrivilegeEscalation: false、readOnlyRootFilesystem 與 drop capabilities 能縮小 Container 被利用後的能力。' },
      { title: 'Pod Security Standards 建立基線', body: 'Privileged、Baseline、Restricted 定義逐步加嚴的安全層級，可透過 Pod Security Admission 在 Namespace 套用。' },
      { title: '供應鏈與執行期要串起來', body: '可信來源、digest、簽章、SBOM、掃描、admission policy 與 runtime 偵測各自處理不同階段，不能互相取代。' },
    ],
    decisions: [
      { scenario: '應用完全不需要 Kubernetes API', choose: '停用 token 自動掛載', reason: '減少不必要 credential 暴露。' },
      { scenario: '只需讀取同 Namespace ConfigMap', choose: 'Namespaced Role + RoleBinding', reason: '不要直接給 cluster-admin 或 ClusterRoleBinding。' },
      { scenario: '限制服務間橫向移動', choose: 'Default deny + 明確 NetworkPolicy', reason: '身分授權與網路可達性要同時控制。' },
    ],
    command: { label: '確認實際授權與安全設定', language: 'bash', code: 'kubectl auth can-i --list\nkubectl auth can-i get secrets --as=system:serviceaccount:default:app\nkubectl get role,rolebinding -A\nkubectl get pod <POD_NAME> -o jsonpath="{.spec.securityContext}"' },
    lessonPath: '/learn/configuration',
    lessonLabel: '回到 ConfigMap、Secret 與儲存',
    source: { label: 'Kubernetes：Security', href: 'https://kubernetes.io/docs/concepts/security/' },
  },
  {
    id: 'operations',
    number: '10',
    category: 'Operations',
    title: '觀測、除錯與持續交付',
    summary: '把 logs、metrics、events、traces 與變更紀錄串成證據鏈，再用可審查的部署流程讓修正可驗證、可回復。',
    mentalModel: '先定義現象與時間範圍，再由外往內縮小：Service → Endpoint → Pod → Container → Node；每一步都用證據淘汰假設。',
    points: [
      { title: '四種訊號回答不同問題', body: 'Metrics 看趨勢與警報、logs 看事件細節、traces 看跨服務路徑、Kubernetes events 看控制平面近期判斷。' },
      { title: 'describe 是狀態故事', body: 'describe 整合 conditions、Container state 與 events，適合 Pending、ImagePullBackOff、probe 失敗等控制面問題。' },
      { title: '宣告式交付先看 diff', body: 'kubectl diff、server-side dry-run 與 Git review 能在 apply 前暴露變更；rollout status 與驗收指標確認結果。' },
      { title: '工具不是營運策略', body: 'Helm、Kustomize、GitOps controller 能管理包裝與同步，但仍需要 SLO、告警、備份、升級、容量與事件回顧。' },
    ],
    decisions: [
      { scenario: 'CrashLoopBackOff', choose: 'logs --previous + describe', reason: '同時取得前次程序輸出與 kubelet events。' },
      { scenario: 'Service 無流量', choose: 'EndpointSlice → readiness → selector', reason: '先確認資料平面是否有可用後端。' },
      { scenario: '發布後指標惡化', choose: '停止 rollout 或 rollback', reason: '先恢復服務，再保留證據分析根因。' },
    ],
    command: { label: '固定的除錯與發布證據鏈', language: 'bash', code: 'kubectl get pods -o wide\nkubectl describe pod <POD_NAME>\nkubectl logs <POD_NAME> --previous\nkubectl get events --sort-by=.metadata.creationTimestamp\nkubectl diff -f k8s/' },
    lessonPath: '/learn/debug-capstone',
    lessonLabel: '回到除錯與 Capstone',
    source: { label: 'Kubernetes：Logging architecture', href: 'https://kubernetes.io/docs/concepts/cluster-administration/logging/' },
  },
  {
    id: 'packaging-gitops',
    number: '11',
    category: 'Operations',
    title: 'Helm、Kustomize 與 GitOps',
    summary: '當環境與服務數量增加，重複貼上 YAML 很快就失去可追蹤性。Kustomize 管理差異、Helm 封裝可重用套件，GitOps 再讓 Git 中的期望狀態持續與叢集同步。',
    mentalModel: '先建立可閱讀、可重現的渲染結果，再讓自動化交付；工具的責任是產生與同步 manifests，不是替你決定正確架構。',
    points: [
      { title: '原始 YAML 是共同語言', body: '小型系統可直接維護 manifests；無論使用哪種包裝工具，最後都應能檢視送進 Kubernetes API 的完整 YAML。' },
      { title: 'Kustomize 疊加環境差異', body: 'base 保存共同資源，overlay 只描述開發、測試與正式環境的差異；它不需要模板語法，並已整合在 kubectl。' },
      { title: 'Helm 封裝與版本化應用', body: 'Chart 結合 templates、values、依賴與版本，適合散布可重用應用；values schema、lint 與 template 測試可減少錯誤輸入。' },
      { title: 'GitOps 持續調和而非只跑部署腳本', body: 'Git 保存宣告式期望狀態，controller 偵測 drift 並持續 reconciliation；合併權限、Secret 管理與 promotion 流程仍需明確設計。' },
    ],
    decisions: [
      { scenario: '少量環境只差 Image tag 或副本數', choose: 'Kustomize base + overlays', reason: '以 patch 表達差異，避免複製整份 manifest。' },
      { scenario: '同一套應用要交付給多個團隊', choose: 'Helm Chart', reason: '可用版本、values 與 dependency 建立清楚的套件介面。' },
      { scenario: '需要偵測手動修改與自動復原', choose: 'GitOps controller', reason: '讓叢集狀態持續對齊經審查的 Git revision。' },
    ],
    command: { label: '先渲染、檢查差異，再交付', language: 'bash', code: 'kubectl kustomize k8s/overlays/dev\nkubectl diff -k k8s/overlays/dev\nhelm lint charts/container-lab\nhelm template container-lab charts/container-lab -f values-dev.yaml' },
    lessonPath: '/learn/release',
    lessonLabel: '回到 Scale、Probe 與 Rollout',
    source: { label: 'OpenGitOps：GitOps Principles', href: 'https://opengitops.dev/' },
  },
  {
    id: 'cluster-lifecycle',
    number: '12',
    category: 'Operations',
    title: '正式叢集生命週期與平台治理',
    summary: '正式 Kubernetes 不只要「建得起來」，還要處理租戶邊界、容量、高可用、升級、備份、災難復原、成本與責任分工。',
    mentalModel: 'Cluster 也是一項需要 SLO 與生命週期管理的產品；控制平面、Node、附加元件與工作負載都有版本、容量與故障模式。',
    points: [
      { title: 'Namespace 不是完整安全邊界', body: 'Namespace、RBAC、ResourceQuota、LimitRange、NetworkPolicy 與 Pod Security Admission 要搭配使用；高風險或強法規工作負載可能仍需獨立叢集。' },
      { title: '高可用要跨越真正的故障域', body: 'Control plane、etcd、Node 與應用副本應避免集中在單一機器或可用區，並定義失去一個區域時的容量與復原目標。' },
      { title: '升級是相容性專案', body: '先閱讀 release notes 與 deprecated API，確認 kubectl、kubelet、CNI、CSI、Ingress/Gateway controller 與 operators 的相容矩陣，再分階段升級。' },
      { title: '備份必須以還原演練證明', body: '自管叢集需保護 etcd；託管叢集也要備份應用資料與 manifests。明確定義 RPO/RTO，定期在隔離環境測試還原。' },
    ],
    decisions: [
      { scenario: '團隊小且不想維護 control plane', choose: '託管 Kubernetes', reason: '把控制平面可用性與部分升級責任交給雲端服務，但 Node、附加元件與應用仍由團隊管理。' },
      { scenario: '多團隊共用叢集且常互搶資源', choose: 'Quota + LimitRange + 權限與網路邊界', reason: '同時限制總量、預設 requests/limits、API 權限與東西向流量。' },
      { scenario: '有明確災難復原目標', choose: '依 RPO/RTO 設計備份與重建流程', reason: '只保留 manifests 無法復原資料，只備份資料也無法快速重建平台設定。' },
    ],
    command: { label: '盤點叢集健康、容量與治理邊界', language: 'bash', code: 'kubectl version\nkubectl get --raw="/readyz?verbose"\nkubectl get nodes -o wide\nkubectl get resourcequota,limitrange -A\nkubectl api-resources' },
    lessonPath: '/learn/debug-capstone',
    lessonLabel: '回到除錯與 Capstone',
    source: { label: 'Kubernetes：Production environment', href: 'https://kubernetes.io/docs/setup/production-environment/' },
  },
]

export type ReadinessGate = {
  area: string
  question: string
  evidence: string
}

export const productionReadiness: ReadinessGate[] = [
  { area: 'Build', question: '產物是否可重現、可追溯且經過檢查？', evidence: '固定基礎 Image、保留 digest／SBOM／掃描結果，以非 root 使用者執行。' },
  { area: 'Deploy', question: '部署失敗時能否安全停止並回復？', evidence: '先看 diff，設定滾動策略，保存 revision，驗證 rollout 與 rollback。' },
  { area: 'Traffic', question: '流量路徑與信任邊界是否清楚？', evidence: '驗證 Service／EndpointSlice／DNS／TLS，並以 NetworkPolicy 限制非必要連線。' },
  { area: 'State', question: '資料遺失時能復原到哪個時間點？', evidence: '確認 PVC 與 StorageClass、建立備份，並以還原演練證明 RPO／RTO。' },
  { area: 'Reliability', question: '單一 Pod、Node 或可用區失效時會怎樣？', evidence: '設定 requests／limits、probes、PDB、拓撲分散與足夠的故障後容量。' },
  { area: 'Security', question: '工作負載只擁有必要的身分與能力嗎？', evidence: '專用 ServiceAccount、最小 RBAC、Restricted security context 與受控 Secret。' },
  { area: 'Observe', question: '值班人員能在影響擴大前看見並定位問題嗎？', evidence: '服務指標、集中 logs、traces、有效告警、dashboard 與對應 runbook。' },
  { area: 'Operate', question: '誰負責容量、升級、事件與災難復原？', evidence: '定義 owner、SLO、容量門檻、版本節奏、事件回顧與定期 DR 演練。' },
]

export const knowledgeStats = {
  domains: knowledgeDomains.length,
  concepts: knowledgeDomains.reduce((total, domain) => total + domain.points.length, 0),
  decisions: knowledgeDomains.reduce((total, domain) => total + domain.decisions.length, 0),
}

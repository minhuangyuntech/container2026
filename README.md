# Container Lab

聚焦 Docker 與 Kubernetes 基礎知識、動手實作及部署應用的繁體中文互動教學網站。

## 網站內容

- 11 個循序章節：環境準備、Docker、Compose、Kubernetes 與最終專題
- 開始前說明硬體／作業系統需求、版本相容規則與七種常見 Kubernetes 實作
- 容器、Docker Compose、Kubernetes 三個核心主題的深度基礎導讀
- 每課包含學習目標、核心觀念、可複製指令、Lab、常見錯誤與小測驗
- 內建可縮放 SVG 架構圖與情境化指令說明
- 全站搜尋、指令速查、疑難排解與中英名詞表
- 使用瀏覽器 `localStorage` 保存完成進度與顯示偏好，不蒐集個人資料
- 響應式深色／淺色介面

## 本機開發

需要 Node.js 22 以上版本。

```bash
npm install
npm run dev
```

正式建置與測試：

```bash
npm test
npm run build
npm run preview
```

## GitHub Pages 發布

專案已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 後：

1. 到 GitHub repository 的 **Settings → Pages**。
2. 將 **Build and deployment → Source** 設成 **GitHub Actions**。
3. Workflow 會測試、建置並發布 `dist`。

Vite 會從 `GITHUB_REPOSITORY` 自動推導 Pages base path，因此 repository 不一定要命名為 `container2026`。路由使用 `HashRouter`，直接重新整理課程頁面也不會依賴伺服器 rewrite。

## Docker

專案同時提供一個可用來練習容器建置與部署的範例服務：

```bash
docker build -t container-lab:local .
docker run --rm -p 8080:80 container-lab:local
```

瀏覽 `http://localhost:8080`，健康檢查端點為 `http://localhost:8080/healthz`。

## Kubernetes

教材以 **Kubernetes v1.36** 為基準，範例使用穩定的 `core/v1` 與 `apps/v1` API，預期可在仍受上游維護的 v1.34–v1.36 執行。建議使用 kubectl v1.35 或 v1.36；依 Kubernetes 官方政策，kubectl 可與 kube-apiserver 相差一個 minor version。

Windows 與 macOS 初學者建議使用 Docker Desktop 內建 Kubernetes；若希望快速建立、刪除並重建練習叢集，建議使用 kind。

先讓本機叢集能取得 `container-lab:local` Image，再套用 manifests：

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/container-lab
kubectl port-forward service/container-lab 8080:80
```

kind 使用者可先執行：

```bash
kind load docker-image container-lab:local
```

## 技術

網站實作採用 React、TypeScript、Vite、輕量 Hash Router、Lucide Icons、Vitest 與 Testing Library；課程內容本身不要求具備 React 知識。

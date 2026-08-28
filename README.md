# 銀行高利活存攻略

台灣數位帳戶高利活存的比較表與資金配置建議工具。輸入手上的現金、勾選已持有與考慮申辦的銀行，就會依利率由高到低把錢填進各家的優惠額度，算出總利息。

線上版：<https://rexx.github.io/Taiwan-Bank-High-Interest-Rate/>

資料來源是 PTT Bank_Service 板的年度總整理文：<https://www.ptt.cc/bbs/Bank_Service/M.1767533701.A.974.html>

## 本地開發

需要 Node.js 24 以上。

```bash
npm install
npm run dev     # 開發伺服器
npm run build   # tsc 型別檢查 + vite 打包到 dist/
npm run preview # 預覽打包結果
```

不需要任何環境變數或 API key。

## 部署

推上 `main` 會觸發 `.github/workflows/deploy.yml`，自動打包並發佈到 GitHub Pages。

## 專案結構

| 路徑 | 說明 |
|---|---|
| `data/banks.ts` | 所有銀行利率資料，網站唯一的資料來源 |
| `data/README.md` | **資料模型與維護指南——要改利率或新增銀行請先看這份** |
| `types.ts` | `BankData` / `BankRateInfo` 型別定義 |
| `App.tsx` | 全部的 UI 與配置演算法 |
| `references/` | 每次更新當下的 PTT 原文與規則圖快照 |
| `public/` | PWA icon 與 manifest |

## 更新銀行資料

PTT 原文大約半年換一次檔期。更新步驟與資料模型的設計理由（特別是同一家銀行拆成多個利率級距時的規則）都寫在 [`data/README.md`](data/README.md)。

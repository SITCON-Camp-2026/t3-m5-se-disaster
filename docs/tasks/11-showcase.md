# 成果交流

## 時間

20:00–21:00

## 你現在拿到的來源

- GitHub Pages demo
- `docs/spec.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `docs/decisions.md`
- `docs/handoff.md`
- `docs/ai-log.md`
- event injection response
- handoff feedback

## 你要做什麼

準備 90 秒 lightning pitch 與成果市集展示。

90 秒請回答：

1. 我們處理的資訊斷點是什麼？
2. Phase 0 時最錯誤的假設是什麼？
3. event injection 打破了哪個設計假設？
4. 我們最後如何處理不確定性？
5. AI 幫最多與最危險的地方是什麼？
6. GitHub Pages demo 中要看哪個畫面？

## 成果放置位置

展示入口：

- GitHub Pages demo URL
- 若尚未完成正式 Pages deploy，至少要能用 `pnpm dev` 或 `pnpm preview` 展示同一個入口

展示依據：

- `src/app/App.tsx`
- `src/components/` 或 `src/features/`
- `src/fixtures/workspace/`，若你們有整理後的資料
- `src/adapters/`，若 event injection 有資料轉換
- `docs/spec.md`
- `docs/data-contract.md`
- `docs/decisions.md`
- `docs/ai-log.md`
- `docs/handoff.md`

不要新增功能。只整理展示路線。

## 你不需要做什麼

- 不排名
- 不宣稱這是真實救災系統
- 不展示真實個資
- 不把未完成包裝成完成
- 不再新增功能
- 不只展示文件而不打開 demo

## 可以怎麼使用 Coding Agent

可以請 Coding Agent 幫你整理 90 秒講稿，但內容必須來自你們自己的 spec、decision、event response、handoff feedback 與 GitHub Pages demo。

請要求它產出：

1. demo opening line
2. demo path：觀眾應該看哪個畫面
3. 3 個工程取捨
4. 1 個 AI 協作反思

## 必須交付什麼

- [ ] 可操作 demo
- [ ] GitHub Pages demo URL 或本機等價入口
- [ ] 90 秒 lightning pitch
- [ ] 一句話元件說明
- [ ] event injection 學習
- [ ] handoff 學習
- [ ] AI 協作反思

## 完成定義

成果交流時，其他人能直接打開 GitHub Pages demo 操作或觀看成果。聽眾能理解你們不是只做了畫面，而是經歷了需求釐清、schema、變更處理與交接。

## 停止條件

19:40 後禁止新增功能，只準備展示與說明。

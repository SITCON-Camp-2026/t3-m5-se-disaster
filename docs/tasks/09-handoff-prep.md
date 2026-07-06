# Handoff Prep：準備交接

## 時間

18:20–18:40

## 你現在拿到的來源

- `docs/spec.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `docs/decisions.md`
- `docs/handoff.md`
- repo code
- GitHub Pages demo 或本機 build 結果
- event injection response

## 你要做什麼

整理 repo，讓另一組可以在有限時間內接手。

請寫清楚：

1. 如何啟動專案
2. GitHub Pages demo URL 或預期部署位置
3. 重要檔案在哪裡
4. 主流程從哪裡進入
5. 目前完成哪些 acceptance criteria
6. 目前還有哪些已知問題
7. 資料入口在哪裡
8. 下一位接手者可以做的一個小任務

## 成果放置位置

交接文件：

- `docs/handoff.md`

若啟動方式或 demo 入口有變：

- `README.md`

若發現 demo 沒有接上成果，只做最小修正：

- `src/app/App.tsx`
- `src/components/`
- `src/features/`

不要再新增主要功能。handoff 階段的重點是讓別人能找到成果，而不是讓成果變更大。

## 你不需要做什麼

- 不新增功能
- 不重寫 README 成完整報告
- 不隱藏還沒完成的問題
- 不把已知限制包裝成設計完成
- 不只寫「請看 code」，要指出具體路徑

## 可以怎麼使用 Coding Agent

建議使用 `docs/prompts/handoff.md`。

可以請 Coding Agent 根據目前 repo 狀態整理 handoff，但最後必須由小組確認內容正確。

請要求它檢查：

1. demo 是否真的從 `src/app/App.tsx` 可進入
2. 哪些 fixture / adapter / component 是主流程必要檔案
3. 哪些文件解釋資料契約與 event response

## 必須交付什麼

- [ ] `docs/handoff.md` 完成
- [ ] `docs/handoff.md` 寫出 GitHub Pages demo 入口
- [ ] `docs/handoff.md` 寫出主流程相關檔案路徑
- [ ] `README.md` 若有啟動方式變更，需要更新
- [ ] `docs/spec.md` 標記已完成與未完成 AC
- [ ] `docs/decisions.md` 至少有重要決策
- [ ] 一個 commit，建議訊息：`Prepare handoff`

## 完成定義

另一組只靠 GitHub Pages demo、README、`docs/handoff.md` 和 repo，就能啟動專案、找到主流程、理解資料入口與目前限制。

## 停止條件

18:40 停止整理，進入 Handoff Challenge。

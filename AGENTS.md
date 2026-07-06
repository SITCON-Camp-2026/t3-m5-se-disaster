# Agent Instructions

0. 接手前先閱讀 `docs/course-context.md`，了解課程目的、固定決策、資料釋出規則與 repo 邊界。
1. 修改程式前先閱讀 `docs/spec.md`、`docs/data-contract.md` 與 `docs/output-paths.md`。
2. 可展示成果必須接進 Vite app。若新增 component、fixture、adapter 或 feature，必須確認它能從 `src/app/App.tsx` 被使用，除非該檔案明確只是文件、測試或 event input。
3. 不要只新增未被引用的 component 或資料檔。若新增 UI 元件，必須說明它由哪個入口 render。
4. 不得新增後端、資料庫或外部 runtime API。
5. 不得放入 API key、密碼、真實個資或真實災情資料。
6. 所有 runtime 資料使用 mock data。
7. `events/**` 是外部 dirty data，不代表可直接進入核心模型，也不可直接當作 GitHub Pages demo 的內部資料。
8. `src/fixtures/**` 是 normalized internal data，必須通過 validation；小組整理後的 normalized data 優先放在 `src/fixtures/workspace/`。
9. 遇到外部資料格式不一致時，優先寫 adapter，不要直接污染 core schema。
10. 不得自行修改 `CommonRecord`。若需要擴充 family schema，必須更新 `docs/data-contract.md` 與測試。
11. AI 輸出必須對應 acceptance criteria，且最後要能在 GitHub Pages demo 或文件中被驗證。
12. 使用 AI / Coding Agent 完成重要工作時，必須更新 `docs/ai-log.md`；不需要逐字貼 prompt，但要記錄任務、AI 建議、採用或拒絕、人類判斷理由，以及相關檔案或 commit。
13. 完成前執行 `pnpm run check`，至少確認 `pnpm build` 產生的網頁會包含本階段可展示成果。
14. 重大設計決策記錄於 `docs/decisions.md`。
15. 不確定需求時，不可自行補完為救災決策。

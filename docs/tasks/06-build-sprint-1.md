# Build Sprint 1：完成主流程

## 時間

13:50–15:20

## 你現在拿到的來源

- `docs/spec.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `src/contracts/`
- `src/fixtures/shared/`
- staff 在 10:50 釋出的 `src/fixtures/released/1050/`

## 你要做什麼

根據已鎖定的 spec，完成一條可操作的主流程前端 demo。

最低要求：

1. 使用 normalized fixtures
2. 使用既有 schema
3. 顯示資料來源與查核狀態
4. 顯示至少 3 種狀態
5. UI 能對應 acceptance criteria
6. 至少一個測試
7. `pnpm build` 後成果會出現在 GitHub Pages 首頁

## 成果放置位置

請遵守 `docs/output-paths.md`。

前端 demo：

- 主流程必須從 `src/app/App.tsx` 可進入
- 可新增或修改 `src/components/`
- 若需要較大的功能分區，可新增 `src/features/<feature-name>/`
- 新增 component 後必須被 `App.tsx` 或它匯入的 component 使用

資料：

- 使用 `src/fixtures/shared/`
- 或使用 staff 釋出的 `src/fixtures/released/1050/`
- 若小組產生 normalized data，放在 `src/fixtures/workspace/`
- 不要把小組成果覆蓋到 `src/fixtures/shared/`

schema：

- 可擴充 family schema，例如 `src/contracts/report.ts`、`src/contracts/site.ts`、`src/contracts/task.ts`
- 不可自行修改 `src/contracts/common.ts`

adapter：

- 若需要資料轉換，放在 `src/adapters/`
- adapter 需要被 UI flow 或測試使用，不要只放著未引用

測試：

- 放在 `tests/`

文件：

- 更新 `docs/spec.md`
- 更新 `docs/data-contract.md`
- 更新 `docs/decisions.md`
- 更新 `docs/ai-log.md`

## 你不需要做什麼

- 不擴大 scope
- 不接外部 API
- 不做登入
- 不做後端
- 不把 `events/**` 當成內部資料
- 不隨意改 `CommonRecord`
- 不做完整地圖
- 不只新增未被使用的 component

## 可以怎麼使用 Coding Agent

建議使用 `docs/prompts/build-sprint.md`。

每次要求 Coding Agent 實作前，先提供：

- 相關 AC
- 相關 schema
- 相關 fixture
- 可修改檔案範圍
- `docs/output-paths.md`

請要求 Coding Agent 先說明：

1. 要修改哪些檔案
2. 哪些檔案會出現在 GitHub Pages demo
3. UI 從 `src/app/App.tsx` 如何進入
4. 哪些資料放在 `src/fixtures/workspace/`

## 必須交付什麼

- [ ] 主流程可操作
- [ ] GitHub Pages 首頁能看到主流程
- [ ] 至少 2 條 AC 可展示
- [ ] UI 顯示 source / status / updatedAt
- [ ] 至少 1 個測試
- [ ] `pnpm build` 成功
- [ ] 一個 commit，建議訊息：`Implement main flow`

## 完成定義

`pnpm build` 後，GitHub Pages 首頁能展示主流程。一位沒有參與你們討論的人，可以依照 UI 操作並看出這個元件解決的是哪個資訊斷點。

## 停止條件

15:10 後停止新增主要功能，只修 demo blocker、補文件、確認成果已接進 `src/app/App.tsx`，或準備 event injection。

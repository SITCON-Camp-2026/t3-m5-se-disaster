# Event Injection：處理新資料與 schema mismatch

## 時間

15:35–16:20

## 你現在拿到的來源

- staff 發出的 event PR
- `events/event-1535/README.md`
- `events/event-1535/incoming-data.json`
- `events/event-1535/task.md`
- `events/event-1535/notes-for-review.md`
- `docs/spec.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `src/contracts/`

## 你要做什麼

先讀 PR diff，不要立刻寫 code。

請判斷：

1. incoming data 哪裡不符合 schema？
2. 這是資料錯誤、新需求，還是外部格式差異？
3. 要寫 adapter、擴充 family schema、標為 `needs_review`，還是 reject？
4. 這筆資料進 UI 後，會不會被誤認為已確認事實？
5. event response 要如何在 GitHub Pages demo 中被看見？

## 成果放置位置

請遵守 `docs/output-paths.md`。

外部輸入：

- staff PR 會新增 `events/event-1535/`
- `events/event-1535/incoming-data.json` 是 dirty input
- 不可直接把 `incoming-data.json` 當內部 normalized data

adapter：

- 若需要轉換資料，新增或修改 `src/adapters/`
- adapter 應該被測試或 UI flow 使用，不要只放著未引用

normalized data：

- 轉換後若要給 UI 使用，放在 `src/fixtures/workspace/`
- 不要放進 `src/fixtures/shared/`

UI：

- event response 必須從 `src/app/App.tsx` 可見
- 或透過 `App.tsx` 匯入的 component / feature 可見
- UI 必須顯示這筆資料的不確定性或處理結果

schema：

- 可擴充 family schema
- 不可修改 `src/contracts/common.ts` 或 `CommonRecord`

文件：

- `docs/decisions.md`
- `docs/data-contract.md`
- `docs/ai-log.md`
- 若影響 demo，更新 `docs/handoff.md`

測試：

- 至少新增或更新一個 adapter / validation test，放在 `tests/`

## 你不需要做什麼

- 不直接把 `incoming-data.json` 搬進 `src/fixtures/shared/`
- 不直接改 `CommonRecord`
- 不自動覆蓋正式狀態
- 不讓 AI 做最終判斷
- 不把 schema mismatch 靜默吞掉
- 不只在文件中描述 event response，卻沒有讓 demo 可見

## 可以怎麼使用 Coding Agent

先使用 `docs/prompts/event-injection.md` 的分析 prompt。  
等小組做出決策後，再請 Coding Agent 寫 adapter、更新 UI 或補測試。

請要求 Coding Agent 先說明：

1. dirty input 留在哪裡
2. normalized result 會放在哪裡
3. adapter 由哪個檔案呼叫
4. UI 從哪個入口顯示 event response
5. 哪個測試會驗證這次變更

## 必須交付什麼

- [ ] `docs/decisions.md` 記錄 event decision
- [ ] 若需要，新增 adapter
- [ ] 若需要，更新 family schema，但不改 `CommonRecord`
- [ ] 若產生 normalized data，放在 `src/fixtures/workspace/`
- [ ] GitHub Pages demo 中能看到 event injection 帶來的新狀態、不確定性或處理結果
- [ ] UI 不把不確定資訊顯示成 verified fact
- [ ] 至少新增或更新 1 個測試
- [ ] `docs/data-contract.md` 更新
- [ ] `docs/ai-log.md` 更新
- [ ] 一個 commit，建議訊息：`Handle event injection`

## 完成定義

GitHub Pages demo 中能看出 event injection 帶來的新不確定性，而不是只在文件中描述。你們能說清楚：這筆新資料為什麼不能直接相信，以及你們選擇 adapter / schema extension / needs_review / reject 的理由。

## 停止條件

16:10 後停止大重構，只保留最小可展示的 event response、測試與文件。

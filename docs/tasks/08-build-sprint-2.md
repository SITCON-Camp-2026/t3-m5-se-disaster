# Build Sprint 2：吸收變更

## 時間

16:20–17:20

## 你現在拿到的來源

- event injection decision
- `docs/decisions.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `events/event-1535/`
- `tests/`

## 你要做什麼

這一輪不是繼續加功能，而是把 event injection 帶來的變更吸收進你的元件。

請完成：

1. UI 顯示 event 造成的新狀態或警示
2. adapter 或 schema extension 有文件
3. 不確定資訊不被當成已確認事實
4. 測試補上
5. handoff 文件補上限制
6. GitHub Pages demo 能呈現 event response

## 成果放置位置

請遵守 `docs/output-paths.md`。

event 後的可展示修正：

- `src/app/App.tsx`
- `src/components/`
- `src/features/`
- `src/fixtures/workspace/`
- `src/adapters/`
- `src/contracts/`

文件補強：

- `docs/data-contract.md`
- `docs/decisions.md`
- `docs/handoff.md`
- `docs/ai-log.md`

測試：

- `tests/`

不要把 event dirty input 直接搬到 internal fixture。若需要顯示，請用 adapter 轉成 normalized data，再由 app 顯示。

## 你不需要做什麼

- 不再新增第二條主流程
- 不做大規模重構
- 不為了展示效果隱藏錯誤
- 不把 dirty input 直接當 normalized data
- 不只更新文件而沒有修正 demo

## 可以怎麼使用 Coding Agent

可以請 Coding Agent：

- 寫 adapter
- 補測試
- 檢查 UI 是否漏掉 uncertain / error state
- 補 `docs/data-contract.md`
- 補 `docs/handoff.md`

請要求它先確認：

1. event 處理結果會在哪個畫面看到
2. 哪個 adapter / test 對應這次事件
3. 哪些資料仍是 dirty input
4. 哪些資料已成為 normalized workspace fixture

## 必須交付什麼

- [ ] event data 被正確處理
- [ ] GitHub Pages demo 能看到 event response
- [ ] 不確定資訊沒有被當成事實
- [ ] 測試補上
- [ ] `docs/data-contract.md` 更新
- [ ] `docs/handoff.md` 寫出已知限制
- [ ] `docs/ai-log.md` 更新
- [ ] `pnpm build` 成功
- [ ] `pnpm check` 盡量通過，若未通過，清楚記錄原因

## 完成定義

event injection 的處理結果在 demo 中可見，並能用 docs 解釋。你們可以展示：event injection 打破了哪個假設，以及你們如何用軟體工程方法處理變更。

## 停止條件

17:10 後停止新增功能，確認成果已接進 GitHub Pages demo，準備晚餐前整理目前狀態。

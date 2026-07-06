# Handoff Challenge：接手另一組

## 時間

18:40–19:25

## 你現在拿到的來源

- 另一組 repo
- 另一組 GitHub Pages demo
- 另一組 `docs/handoff.md`
- 另一組 `docs/spec.md`
- 另一組 `docs/output-paths.md`
- staff 發出的 handoff issue

## 你要做什麼

在有限時間內接手另一組 repo，完成一個小任務，或清楚記錄無法完成的原因。

請依序：

1. 打開另一組 GitHub Pages demo，先理解目前可展示成果
2. clone / pull 另一組 repo
3. 依照 `docs/handoff.md` 啟動專案
4. 找到主流程與資料入口
5. 找到 demo 對應的 `src/app/App.tsx` / component / fixture
6. 完成 handoff issue 指定的小修改
7. 回報哪裡清楚、哪裡不清楚

## 成果放置位置

若需要修改另一組 repo：

- 前端 demo 修改應接到對方 repo 的 `src/app/App.tsx`
- 可修改對方 repo 的 `src/components/` 或 `src/features/`
- 若新增 normalized data，放到對方 repo 的 `src/fixtures/workspace/`
- 若新增 adapter，放到對方 repo 的 `src/adapters/`
- 若補測試，放到對方 repo 的 `tests/`
- 若只給 feedback，依 staff 指示回覆 handoff issue 或寫入指定 feedback 文件

不要只新增未被對方 demo 使用的 component。

## 你不需要做什麼

- 不重構另一組專案
- 不批評 UI 美醜
- 不改變另一組核心設計
- 不把無法理解直接歸因於自己不會
- 不只看 code 而不打開 demo

## 可以怎麼使用 Coding Agent

可以請 Coding Agent 幫你讀另一組 repo，但要明確要求它先總結檔案結構與 handoff 內容，不要直接修改。

請要求它找出：

1. GitHub Pages demo 對應的入口
2. `src/app/App.tsx` 如何接到主流程
3. 資料從哪個 fixture / adapter 進來
4. handoff issue 的最小修改應該放在哪裡

## 必須交付什麼

- [ ] 成功啟動另一組 repo，或記錄啟動失敗原因
- [ ] 打開另一組 GitHub Pages demo，理解可展示成果
- [ ] 找到主流程入口與資料來源
- [ ] 完成一個小修改，或清楚說明阻塞點
- [ ] 給原組至少 2 個 handoff feedback
- [ ] 在自己組內記錄接手觀察

## 完成定義

你們能說出：這個 repo 哪些地方讓人容易接手，哪些地方只有原作者知道，以及它的 GitHub Pages demo 是否能對應到 repo 內的檔案。

## 停止條件

19:25 停止修改，準備回到自己的成果包裝。

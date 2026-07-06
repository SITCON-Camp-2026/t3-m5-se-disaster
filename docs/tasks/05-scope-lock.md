# Scope Lock

## 時間

13:30–13:50

## 你現在拿到的來源

- `docs/spec.md`
- `docs/data-contract.md`
- `docs/output-paths.md`
- `docs/decisions.md`
- Spec 市集回饋
- mentor feedback

## 你要做什麼

鎖定下午只做一條主流程，並把不做的事情寫清楚。

請決定：

1. 我們只做哪一條主流程？
2. 哪些功能今天不做？
3. 哪些 schema 欄位是必須？
4. 哪些狀態一定要呈現？
5. 哪些資料不能自動判斷？
6. 哪些檔案是下午主要修改範圍？
7. GitHub Pages demo 要從哪個入口看到成果？
8. 若有小組整理後的 normalized data，要放在哪個 `src/fixtures/workspace/` 檔案？

## 成果放置位置

本階段主要產出是 scope 決策與下午修改計畫。

請更新：

- `docs/spec.md`
- `docs/data-contract.md`
- `docs/decisions.md`

若下午會新增功能，請在 scope lock decision 寫清楚預計修改路徑：

```text
UI entry:
- src/app/App.tsx

Components / features:
- src/components/...
- src/features/...

Data:
- src/fixtures/workspace/...

Adapters:
- src/adapters/...

Tests:
- tests/...
```

## 你不需要做什麼

- 不新增第二條主流程
- 不把每個同學想做的功能都放進 scope
- 不為了漂亮 UI 犧牲資料契約
- 不為了讓 AI 好做就降低安全邊界
- 不在 scope lock 階段大量寫 code

## 可以怎麼使用 Coding Agent

可以請 Coding Agent 幫你把 spec 轉成 task list，但不要讓它決定 scope。

請要求它列出：

1. 哪些檔案下午必須改
2. 哪些檔案不能改
3. 哪些成果會在 GitHub Pages demo 被看到
4. 哪些成果只屬於文件或測試

## 必須交付什麼

- [ ] `docs/spec.md` 有明確 `In scope`
- [ ] `docs/spec.md` 有明確 `Out of scope`
- [ ] `docs/data-contract.md` 有明確 input / output
- [ ] `docs/decisions.md` 有一筆 scope lock decision
- [ ] scope lock decision 寫清楚 demo entry path
- [ ] 建立至少 3 個 GitHub issues 或 task checklist

## 完成定義

下午任何一位組員問「現在該不該做這個功能」或「這個成果要放哪裡」時，都能回到 `docs/spec.md`、`docs/data-contract.md`、`docs/decisions.md` 和 `docs/output-paths.md` 找到答案。

## 停止條件

13:50 後不再換題，不再新增主要功能。進入 Build Sprint 1。

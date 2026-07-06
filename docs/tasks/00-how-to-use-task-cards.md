# 如何使用任務卡

## 時間

整天都會用到。

## 你現在拿到的來源

- `docs/tasks/`：每個階段的任務卡
- `docs/output-paths.md`：成果放置路徑與 GitHub Pages 展示規則
- `docs/prompts/`：可以複製給 Coding Agent 的 prompts
- GitHub Issue：當前階段的 active task
- staff PR：課中才會釋出的分流資料或 event injection

## 你要做什麼

每到一個新階段，先讀該階段任務卡，再開始問 Coding Agent 或修改程式。

任務卡會告訴你：

1. 現在的資料來源是什麼
2. 你要做什麼
3. 你不需要做什麼
4. 成果應該放在哪裡
5. 可以怎麼請 Coding Agent 幫忙
6. 要交付什麼成果
7. 什麼時候該停止加功能

## 成果放置位置

所有階段都要遵守 `docs/output-paths.md`。

最重要的規則：

```text
可展示成果必須能從 GitHub Pages 首頁看到或操作。
```

可展示成果通常要接進：

```text
src/main.tsx
src/app/App.tsx
src/components/
src/features/
src/fixtures/workspace/
src/adapters/
src/contracts/
```

文件、測試與 event input 放在：

```text
docs/
tests/
events/
```

但它們不能取代前端 demo。

## 你不需要做什麼

- 不需要自己猜接下來要做什麼
- 不需要一次讀完整份課程設計
- 不需要提前做後面階段的任務
- 不需要處理尚未釋出的 event data

## 可以怎麼使用 Coding Agent

每次請 Coding Agent 動手前，先提供：

1. 當前任務卡
2. `docs/output-paths.md`
3. `docs/spec.md` 的相關段落
4. `docs/data-contract.md` 的相關段落
5. 相關 schema 或 fixture
6. 明確說明哪些檔案可以改

請要求 Coding Agent 先說明：

- 它打算修改哪些檔案
- 哪些成果會出現在 GitHub Pages demo
- 哪些成果只屬於文件、測試或 event input

## 必須交付什麼

每個階段都有自己的交付物。不要只交付 UI，也不要只交付文件。最後要能被展示、驗證或接手。

## 完成定義

完成不是「寫了很多檔案」，而是該階段要求的成果可被別人理解、驗證、接手，且需要展示的部分能從 GitHub Pages 首頁看到或操作。

## 停止條件

時間到就停止新增功能，改成：

- 確認 demo 是否可見
- 補文件
- 補 AI log
- 補 decision
- commit
- 準備分享

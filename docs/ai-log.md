# AI Log

這份紀錄用來留下小組如何使用 AI / Coding Agent 的操作脈絡。重點不是逐字保存所有對話，而是記錄重要協作、取捨與人類判斷。

## 什麼時候要記錄

請在以下情況更新本檔案：

- AI 協助分析原始資訊。
- AI 協助找出不能判斷處。
- AI 協助判斷哪些資訊不能直接相信。
- AI 協助判斷哪些資訊不能直接變成任務。
- AI 協助修改畫面標示或前端工作台。
- AI 可能補了原文沒有的資訊。
- AI 建議被小組拒絕，且拒絕原因和安全 / 正確性 / scope 有關
- AI 輸出可能造成誤導，例如把未確認資料寫成已確認事實

## 不需要記錄

- 不需要逐字貼完整對話
- 不需要記錄每一次小型 autocomplete
- 不需要記錄單純修 typo 或格式化

## 紀錄格式

| 時間  | 階段    | 任務                   | AI / Agent 建議                                                                                                  | 採用 / 拒絕 | 人類判斷理由                                                                           | 相關檔案 / commit                                                                                                            |
| ----- | ------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 15:20 | Phase 0 | 整理沒有準確資訊的內容 | Agent 建議從原文詞句與查核狀態標示地點不精準、時間可能過期、轉述、衝突與隱私同意等問題，並顯示在首頁卡片與工作台 | 採用        | 只標示「不能直接相信」的原因，不補外部資料、不改查核狀態、不把推測寫成事實             | `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `docs/phase0-observations.md`    |
| 15:20 | Phase 0 | 避免 AI 誤導           | Agent 可能把 M-009、M-010 這類文字較完整的資料整理成高信心候選結果                                               | 拒絕        | 這些資料仍是 `needs_review`，畫面只能說需要人工確認，不能顯示成 confirmed / verified   | `src/features/phase-0/Phase0JudgementCard.tsx`, `docs/phase0-observations.md`                                                |
| 15:45 | Phase 0 | 加上想呈現的三種統整   | Agent 建議在整理工作台加入「物資統整、人數統整、集合點整合」，只從原始資訊抓線索並顯示查核狀態                   | 採用        | 這符合小組想呈現的內容，但必須標成候選統整草稿，不能把物資、人數或集合點當作已確認資料 | `src/features/phase-0/Phase0PresentationDraft.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `tests/app-smoke.test.tsx`   |
| 16:05 | Phase 0 | 讓整理工作台可改內容   | Agent 建議新增頁面內草稿表單，讓每筆原始資訊可建立、編輯、刪除與重設整理草稿                                     | 採用        | 草稿只存在前端頁面狀態，不寫回原始 JSON、不使用 localStorage，也不把內容標成已確認     | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `tests/app-smoke.test.tsx`         |
| 16:20 | Phase 0 | 改成粉紅貓咪風格       | Agent 建議用 CSS 調整粉紅色視覺、卡片與按鈕，並在首頁加入不影響內容判讀的貓咪裝飾                                | 採用        | 只改呈現風格，不改原始資料、查核狀態或待確認標示，避免可愛風格讓資料看起來像已確認     | `src/app/App.tsx`, `src/styles/global.css`, `docs/ai-log.md`                                                                 |
| 16:30 | Phase 0 | 簡化整理草稿欄位       | Agent 依小組需求移除草稿表單中的「為什麼不能直接變成任務」與「下一步」欄位                                       | 採用        | 表單更貼近想呈現的內容；其他安全邊界與待確認標示仍保留在工作台，不把資料改成已確認     | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`       |
| 16:40 | Phase 0 | 統整類型改成複選       | Agent 建議把單選的統整類型改成 checkbox 群組，讓同一筆原始資訊可同時標示物資、人數、集合點等類型                 | 採用        | 原始資訊可能同時包含多種線索；複選仍只是草稿分類，不代表資料已確認或可派工             | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`       |
| 16:45 | Phase 0 | 備註欄改成可信度       | Agent 依小組需求把「人工確認備註」改成「可信度」，讓草稿更聚焦在資訊可信程度                                     | 採用        | 可信度仍是草稿文字，不新增 confirmed / verified 選項，也不改變原始查核狀態             | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`       |
| 16:55 | Phase 0 | 加上 AI 可信度數據     | Agent 建議用既有查核狀態與待確認訊號產生 AI 輔助可信度分數、等級與原因                                           | 採用        | 這是前端規則估算，不呼叫 runtime LLM，不代表事實查核結果，畫面需明確標示仍需人工確認   | `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0DraftEditor.tsx`, `tests/phase0-heuristics.test.ts` |
| 17:05 | Phase 0 | 內容改成分項填寫       | Agent 建議依照已勾選的統整類型顯示「物資：」「人數：」「集合點：」等分項內容欄位                                 | 採用        | 同一筆原始資訊可能有多種整理方向；分項欄位仍只是草稿，不代表已完成資料整理或查核       | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`       |
| 17:15 | Phase 0 | 可信度自動重新分析     | Agent 建議讓 AI 輔助可信度同時參考原始資訊與目前草稿內容，使用者補充內容後即時重算分數與原因                     | 採用        | 重新分析仍是前端規則估算，不呼叫真實 LLM，不代表內容已查核或可以直接派工               | `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0DraftEditor.tsx`, `tests/phase0-heuristics.test.ts` |
| 17:20 | Phase 0 | 移除可信度輸入框       | Agent 依小組需求移除「可信度」手填文字框，只保留 AI 輔助可信度數據                                               | 採用        | 可信度應由原始資訊與草稿內容自動估算，避免手填文字讓人誤以為已完成查核                 | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`       |
| 17:30 | Phase 0 | 新增儲存進度按鈕       | Agent 建議新增「儲存本頁進度」按鈕與儲存狀態文字，將草稿保存到目前頁面工作階段                                   | 採用        | 不使用 localStorage、後端或寫回 JSON；儲存只代表本頁 state 已保存，不代表資料已確認    | `src/features/phase-0/Phase0Workbench.tsx`, `src/features/phase-0/Phase0DraftEditor.tsx`, `tests/app-smoke.test.tsx`         |
| 17:40 | Phase 0 | 儲存後依可信度整理     | Agent 建議儲存後在右側顯示「待人工確認依可信度整理」，用已儲存草稿計算可信度並排序                               | 採用        | 只排序待人工確認資料，不把它改成已確認，也不把排序當成派工優先順序                     | `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`                              |
| 17:50 | Phase 0 | 可信度從 0 開始計算    | Agent 建議把可信度公式改成從 0 分起算，只依查核狀態、來源型別、明確時間、數量與現場線索加分                      | 採用        | 避免原本高基準扣分讓待確認資料看起來太可信；仍保留人工確認與非事實查核提醒             | `src/features/phase-0/phase0-heuristics.ts`, `tests/phase0-heuristics.test.ts`                                               |

## 範例

| 時間  | 階段    | 任務         | AI / Agent 建議                        | 採用 / 拒絕 | 人類判斷理由                              | 相關檔案 / commit             |
| ----- | ------- | ------------ | -------------------------------------- | ----------- | ----------------------------------------- | ----------------------------- |
| 09:45 | Phase 0 | 分析原始資訊 | 建議把社群貼文直接轉成 verified report | 拒絕        | 社群貼文來源未確認，應保持 `needs_review` | `docs/phase0-observations.md` |

## 課後反思

### AI 幫助最大的地方

- 快速找出原文中會讓整理失準的訊號，例如模糊地點、過期時間、轉述、衝突說法與公開同意。

### AI 最容易誤導的地方

- 文字越完整，agent 越容易把它當成已確認事實；但 Phase 0 必須看查核狀態與原文限制。

### 下次使用 AI 開發前，我們會先準備

- 先定義哪些欄位只能人工確認，哪些文字只能當作待確認訊號，避免 agent 自動補成正式資料。

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

| 時間  | 階段       | 任務                    | AI / Agent 建議                                                                                                                       | 採用 / 拒絕 | 人類判斷理由                                                                                                    | 相關檔案 / commit                                                                                                               |
| ----- | ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 15:20 | Phase 0    | 整理沒有準確資訊的內容  | Agent 建議從原文詞句與查核狀態標示地點不精準、時間可能過期、轉述、衝突與隱私同意等問題，並顯示在首頁卡片與工作台                      | 採用        | 只標示「不能直接相信」的原因，不補外部資料、不改查核狀態、不把推測寫成事實                                      | `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0RawInfoPanel.tsx`, `docs/phase0-observations.md`       |
| 15:20 | Phase 0    | 避免 AI 誤導            | Agent 可能把 M-009、M-010 這類文字較完整的資料整理成高信心候選結果                                                                    | 拒絕        | 這些資料仍是 `needs_review`，畫面只能說需要人工確認，不能顯示成 confirmed / verified                            | `src/features/phase-0/Phase0JudgementCard.tsx`, `docs/phase0-observations.md`                                                   |
| 15:45 | Phase 0    | 加上想呈現的三種統整    | Agent 建議在整理工作台加入「物資統整、人數統整、集合點整合」，只從原始資訊抓線索並顯示查核狀態                                        | 採用        | 這符合小組想呈現的內容，但必須標成候選統整草稿，不能把物資、人數或集合點當作已確認資料                          | `src/features/phase-0/Phase0PresentationDraft.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `tests/app-smoke.test.tsx`      |
| 16:05 | Phase 0    | 讓整理工作台可改內容    | Agent 建議新增頁面內草稿表單，讓每筆原始資訊可建立、編輯、刪除與重設整理草稿                                                          | 採用        | 草稿只存在前端頁面狀態，不寫回原始 JSON、不使用 localStorage，也不把內容標成已確認                              | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/Phase0Workbench.tsx`, `tests/app-smoke.test.tsx`            |
| 16:20 | Phase 0    | 改成粉紅貓咪風格        | Agent 建議用 CSS 調整粉紅色視覺、卡片與按鈕，並在首頁加入不影響內容判讀的貓咪裝飾                                                     | 採用        | 只改呈現風格，不改原始資料、查核狀態或待確認標示，避免可愛風格讓資料看起來像已確認                              | `src/app/App.tsx`, `src/styles/global.css`, `docs/ai-log.md`                                                                    |
| 16:30 | Phase 0    | 簡化整理草稿欄位        | Agent 依小組需求移除草稿表單中的「為什麼不能直接變成任務」與「下一步」欄位                                                            | 採用        | 表單更貼近想呈現的內容；其他安全邊界與待確認標示仍保留在工作台，不把資料改成已確認                              | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`          |
| 16:40 | Phase 0    | 統整類型改成複選        | Agent 建議把單選的統整類型改成 checkbox 群組，讓同一筆原始資訊可同時標示物資、人數、集合點等類型                                      | 採用        | 原始資訊可能同時包含多種線索；複選仍只是草稿分類，不代表資料已確認或可派工                                      | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`          |
| 16:45 | Phase 0    | 備註欄改成可信度        | Agent 依小組需求把「人工確認備註」改成「可信度」，讓草稿更聚焦在資訊可信程度                                                          | 採用        | 可信度仍是草稿文字，不新增 confirmed / verified 選項，也不改變原始查核狀態                                      | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`          |
| 16:55 | Phase 0    | 加上 AI 可信度數據      | Agent 建議用既有查核狀態與待確認訊號產生 AI 輔助可信度分數、等級與原因                                                                | 採用        | 這是前端規則估算，不呼叫 runtime LLM，不代表事實查核結果，畫面需明確標示仍需人工確認                            | `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0DraftEditor.tsx`, `tests/phase0-heuristics.test.ts`    |
| 17:05 | Phase 0    | 內容改成分項填寫        | Agent 建議依照已勾選的統整類型顯示「物資：」「人數：」「集合點：」等分項內容欄位                                                      | 採用        | 同一筆原始資訊可能有多種整理方向；分項欄位仍只是草稿，不代表已完成資料整理或查核                                | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`          |
| 17:15 | Phase 0    | 可信度自動重新分析      | Agent 建議讓 AI 輔助可信度同時參考原始資訊與目前草稿內容，使用者補充內容後即時重算分數與原因                                          | 採用        | 重新分析仍是前端規則估算，不呼叫真實 LLM，不代表內容已查核或可以直接派工                                        | `src/features/phase-0/phase0-heuristics.ts`, `src/features/phase-0/Phase0DraftEditor.tsx`, `tests/phase0-heuristics.test.ts`    |
| 17:20 | Phase 0    | 移除可信度輸入框        | Agent 依小組需求移除「可信度」手填文字框，只保留 AI 輔助可信度數據                                                                    | 採用        | 可信度應由原始資訊與草稿內容自動估算，避免手填文字讓人誤以為已完成查核                                          | `src/features/phase-0/Phase0DraftEditor.tsx`, `src/features/phase-0/phase0-draft-model.ts`, `tests/app-smoke.test.tsx`          |
| 17:30 | Phase 0    | 新增儲存進度按鈕        | Agent 建議新增「儲存本頁進度」按鈕與儲存狀態文字，將草稿保存到目前頁面工作階段                                                        | 採用        | 不使用 localStorage、後端或寫回 JSON；儲存只代表本頁 state 已保存，不代表資料已確認                             | `src/features/phase-0/Phase0Workbench.tsx`, `src/features/phase-0/Phase0DraftEditor.tsx`, `tests/app-smoke.test.tsx`            |
| 17:40 | Phase 0    | 儲存後依可信度整理      | Agent 建議儲存後在右側顯示「待人工確認依可信度整理」，用已儲存草稿計算可信度並排序                                                    | 採用        | 只排序待人工確認資料，不把它改成已確認，也不把排序當成派工優先順序                                              | `src/features/phase-0/Phase0Workbench.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`                                 |
| 17:50 | Phase 0    | 可信度從 0 開始計算     | Agent 建議把可信度公式改成從 0 分起算，只依查核狀態、來源型別、明確時間、數量與現場線索加分                                           | 採用        | 避免原本高基準扣分讓待確認資料看起來太可信；仍保留人工確認與非事實查核提醒                                      | `src/features/phase-0/phase0-heuristics.ts`, `tests/phase0-heuristics.test.ts`                                                  |
| 13:51 | Release 01 | 使用者訪談與需求彙整    | Agent 依 `release-packs/01-interview-kit/` 模擬回報者、資訊整理者、行動者三個 persona，整理出可信度分數、儲存語意、草稿判斷理由等風險 | 部分採用    | 採用「可信度分數容易誤導」與「草稿需保留判斷理由」；不採用讓 AI 決定可行動或派工排序，v1 取捨仍待小組確認       | `docs/interview-notes.md`, `docs/interview-summary.md`, `docs/decisions.md`, `docs/ai-log.md`                                   |
| 14:05 | Release 01 | sub-agent 多觀點補充    | Agent 再次啟用三個 persona，補充 v1 先服務資訊整理者時仍要保留轉述不確定性、避免待確認提示像排名、避免行動者誤讀草稿                  | 採用        | 這些提醒能降低 v1 設計時的誤導風險，但仍只作為需求分析草稿，不代表最後產品決策                                  | `docs/interview-notes.md`, `docs/interview-summary.md`, `docs/decisions.md`, `docs/ai-log.md`                                   |
| 14:12 | Release 01 | 決策草稿觀點檢查        | Agent 讓三個 persona 檢查目前訪談彙整與取捨文件，指出「候選整理」可能太像任務化，且親眼確認/轉述不能只寫在原則裡                      | 採用        | 採用為 v1 前需求風險提醒；實際文案與畫面仍待小組確認，不讓 AI 直接決定最終設計                                  | `docs/interview-notes.md`, `docs/interview-summary.md`, `docs/decisions.md`, `docs/ai-log.md`                                   |
| 14:20 | Release 01 | 固定格式訪談回答        | Agent 讓回報者、資訊整理者、行動者依課程模板六個問題回答，並把回答補進訪談紀錄                                                        | 採用        | 這能讓小組直接比對三種使用者視角；內容仍是 AI 模擬訪談草稿，需要人類確認                                        | `docs/interview-notes.md`, `docs/ai-log.md`                                                                                     |
| 14:25 | Release 01 | 精簡訪談彙整            | Agent 將訪談彙整改成重點版，只保留共同重點、最大風險、v1 取捨、不讓 AI 自動決定與待確認事項                                           | 採用        | 小組需要更容易掃讀的摘要；細節仍保留在訪談紀錄與決策文件中                                                      | `docs/interview-summary.md`, `docs/ai-log.md`                                                                                   |
| 14:30 | Release 01 | 生成三個 v1 決策        | Agent 依目前取捨產生三個決策：先做資訊整理者工作台、使用三段式整理結構、不顯示可信度分數或可行動暗示                                  | 採用        | 這些決策把訪談結果轉成可討論的 v1 方向；仍保留人類確認欄位，不把 AI 草稿當成最終決策                            | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 14:35 | Release 01 | 拉開決策層次            | Agent 將三個 v1 決策改寫成策略層、產品範圍層、畫面與資料層，讓視野從欄位設計拉高到協作安全與產品邊界                                  | 採用        | 小組需要更清楚的決策層次，避免直接跳到 UI 細節或完整產品                                                        | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 14:40 | Release 01 | 確認主決策              | 使用者選擇「策略層，v1 先處理誤判風險」作為主決策，Agent 將其他兩個決策改成支援此方向的落地原則                                       | 採用        | 人類已明確選擇主方向；AI 只協助把決策文件整理清楚                                                               | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 14:45 | Release 01 | 訪談紀錄對齊主決策      | Agent 對照訪談紀錄與主決策，將「AI 輔助可信度」定位為誤判風險，補上 v1 應避免可信排名、派工暗示與正式確認錯覺                         | 採用        | 保留 persona 原始回饋，同時把文件修正到使用者選擇的「先處理誤判風險」方向                                       | `docs/interview-notes.md`, `docs/ai-log.md`                                                                                     |
| 14:50 | Release 01 | 補上我的想法            | Agent 將使用者目前想法整理進決策文件：v1 不是判斷真假，而是讓協作者看見還不能判斷、不能相信、不能行動的原因                           | 採用        | 這是人類主決策的白話化整理，讓後續 v1 設計更容易對齊                                                            | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 14:54 | Release 01 | 用選擇題釐清決策        | Agent 用 12 題選擇題協助釐清 v1 想服務的資訊整理者、平台性格、AI 邊界與成功畫面，並依使用者回答改寫決策文件                           | 採用        | 使用者選擇 v1 是「原始資訊判讀工作台」，重點是讓資訊更清楚、記錄判斷理由、把 AI 可信度改成待確認提醒或風險提示  | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 15:02 | Release 01 | 第二輪追問確認需求      | Agent 依前一輪 12 個回答逐題追問，協助確認整理成果、清楚的意思、AI 邊界、待確認欄位與停止訊號                                         | 採用        | 使用者確認 v1 產出是可交接整理草稿，優先保留原文，AI 只能整理疑點或原文缺漏提示，不能給真假或行動結論           | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 15:10 | Release 01 | 開放式問題補足產品意象  | Agent 用開放式問題引導使用者描述平台像什麼桌面、原文像什麼、完整資訊要如何讓人慢下來                                                  | 採用        | 使用者描述平台像有螢光筆和便利貼的整理桌，原文像證據，完整但未確認的資訊要用紅字標籤提醒                        | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 15:12 | Release 01 | 確認核心信念與反模式    | Agent 將使用者補充的核心信念與最害怕的產品樣貌整理進決策文件                                                                          | 採用        | 使用者確認核心信念是「整理不是確認」，並明確不希望平台長得像 AI 結論產生器                                      | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 15:55 | Release 01 | 排查 GitHub Action 失敗 | Agent 重跑與 CI 相同的 `pnpm check`，發現 `docs/decisions.md` 未通過 Prettier 格式檢查，修正檔案結尾換行後重新驗證                    | 採用        | 這是格式檢查失敗，不涉及需求內容或資料判斷；修正後本機 `pnpm check` 已通過                                      | `docs/decisions.md`, `docs/ai-log.md`                                                                                           |
| 16:25 | Release 02 | 繪製 v1 資訊流程圖      | Agent 依 `02-flow-design-kit` 將主決策轉成自然語言流程與 Mermaid，加入人工確認、暫時不採用、留下判斷紀錄與不可自動處理分支            | 採用        | 採用流程草稿作為討論起點；流程明確從 Phase 0 原始資訊開始，不讓 AI 判斷真假、可信排名、派工優先序或可行動性     | `docs/flow.md`, `docs/ai-log.md`                                                                                                |
| 16:40 | Release 03 | 依流程圖實作 v1 工作台  | Agent 依 `docs/flow.md` 新增 `/v1/` 原始資訊判讀工作台，將原文線索、整理者判斷、仍待確認、不能自動處理與判斷紀錄分開呈現              | 採用        | v1 仍只使用 Phase 0 原始資訊，不新增後端、資料庫、外部 API 或 LLM；採用保守流程輸出，不顯示可信度分數作為主訊號 | `src/app/App.tsx`, `src/features/v1/**`, `src/styles/global.css`, `tests/app-smoke.test.tsx`, `docs/ai-log.md`                  |
| 16:50 | Release 03 | 補 v1 可編輯草稿        | 使用者指出 v1 沒有可以修改的地方，Agent 建議新增本頁內可編輯整理草稿欄位與保存紀錄                                                    | 採用        | 採用互動修正，但仍只保存到本頁狀態，不寫回原始資料、不使用後端或 localStorage，也不把草稿顯示成已確認資料       | `src/features/v1/V1FlowWorkbench.tsx`, `src/features/v1/v1-flow-model.ts`, `src/styles/global.css`, `tests/app-smoke.test.tsx`  |
| 16:55 | Release 03 | 補 v1 流程輸出切換      | 使用者要求需要人工確認、暫時不採用與可交接草稿可以交換更改，Agent 新增本頁手動調整流程輸出的 radio 控制與判斷紀錄                     | 採用        | 採用可交換調整，但標示為本頁手動判斷；可交接草稿仍不代表查核完成，也不能把資料變成 confirmed / verified 或任務  | `src/features/v1/V1FlowWorkbench.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`, `docs/ai-log.md`                    |
| 17:03 | Release 03 | 補編輯與簡易頁流程      | 使用者要求先顯示編輯按鈕，按下後進可編輯頁，保存後顯示簡易頁；Agent 將 v1 改為「簡易頁 → 編輯草稿 → 保存並交出 → 簡易頁」流程         | 採用        | 採用交接頁互動，但交出只代表本頁狀態，不代表正式提交、查核完成或可行動任務                                      | `src/features/v1/V1FlowWorkbench.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`, `docs/ai-log.md`                    |
| 17:13 | Release 03 | 同步 v1 文件與交出狀態  | Agent 依目前實作修正 `docs/flow.md` 與 `docs/decisions.md`，並在左側列表補上本頁已交出標示與測試                                      | 採用        | 文件需對齊實際畫面流程；已交出只代表本頁草稿已保存，不代表正式提交、查核完成或可行動任務                        | `docs/flow.md`, `docs/decisions.md`, `src/features/v1/V1FlowWorkbench.tsx`, `tests/app-smoke.test.tsx`, `docs/ai-log.md`        |
| 17:26 | Release 03 | 修正 v1 使用者操作風險  | Agent 依使用者視角建議，新增左側原文摘要、未保存切換提醒、清空確認，並把保存文案改成「保存為本頁交接草稿」                            | 採用        | 這些調整降低整理者迷路、誤按清空或把保存誤解成正式提交的風險；仍只保存本頁狀態，不改原始資料、不新增後端        | `src/features/v1/V1FlowWorkbench.tsx`, `src/styles/global.css`, `tests/app-smoke.test.tsx`, `docs/flow.md`, `docs/decisions.md` |

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

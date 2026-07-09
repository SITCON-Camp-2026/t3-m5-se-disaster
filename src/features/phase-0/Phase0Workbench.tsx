import { useState } from "react";
import { RecordCard } from "../../components/RecordCard";
import { StatusBadge } from "../../components/StatusBadge";
import {
  createEmptyDraft,
  createInitialDrafts,
  type Phase0EditableDraft,
} from "./phase0-draft-model";
import { Phase0DraftEditor } from "./Phase0DraftEditor";
import { Phase0JudgementCard } from "./Phase0JudgementCard";
import { Phase0PresentationDraft } from "./Phase0PresentationDraft";
import {
  createPhase0DraftCredibilityHint,
  createPhase0Judgement,
} from "./phase0-heuristics";
import type { Phase0MessyRecord } from "./phase0-types";

export function Phase0Workbench({
  records,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, Phase0EditableDraft>>(
    () => createInitialDrafts(records),
  );
  const [savedDrafts, setSavedDrafts] = useState<
    Record<string, Phase0EditableDraft>
  >(() => createInitialDrafts(records));
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>();
  const selectedRecord =
    records.find((record) => record.id === selectedRecordId) ?? records[0];
  const safetyBoundary = createPhase0Judgement(selectedRecord);
  const selectedDraft = drafts[selectedRecord.id];
  const draftCount = Object.keys(drafts).length;
  const hasUnsavedChanges =
    JSON.stringify(drafts) !== JSON.stringify(savedDrafts);
  const savedReviewItems = records
    .filter((record) => record.verificationStatus === "needs_review")
    .map((record) => {
      const draft = savedDrafts[record.id] ?? createEmptyDraft(record.id);
      const credibilityHint = createPhase0DraftCredibilityHint(record, draft);

      return {
        record,
        credibilityHint,
      };
    })
    .sort(
      (left, right) =>
        right.credibilityHint.score - left.credibilityHint.score ||
        left.record.id.localeCompare(right.record.id),
    );

  function createDraft(recordId: string) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [recordId]: createEmptyDraft(recordId),
    }));
  }

  function updateDraft(nextDraft: Phase0EditableDraft) {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [nextDraft.recordId]: nextDraft,
    }));
  }

  function deleteDraft(recordId: string) {
    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[recordId];
      return nextDrafts;
    });
  }

  function resetDefaultDrafts() {
    const initialDrafts = createInitialDrafts(records);
    setDrafts(initialDrafts);
    setSavedDrafts(initialDrafts);
    setLastSavedAt(undefined);
  }

  function saveProgress() {
    setSavedDrafts(drafts);
    setLastSavedAt(new Date().toLocaleTimeString("zh-TW", { hour12: false }));
  }

  return (
    <div className="workbench">
      <div className="workbench__intro">
        <p className="eyebrow">整理工作台</p>
        <h2>第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。</h2>
        <p>
          這裡先只標示安全邊界，真正的候選判斷要由小組和 coding agent
          補上；這不是 runtime LLM 分析，也不是正式資料模型。
        </p>
      </div>

      <Phase0PresentationDraft records={records} />

      <div className="workbench__layout">
        <aside className="workbench__queue" aria-label="選擇原始資訊">
          {records.map((record) => (
            <button
              className={record.id === selectedRecord.id ? "active" : ""}
              key={record.id}
              type="button"
              onClick={() => onSelect(record.id)}
            >
              <span>{record.id}</span>
              <StatusBadge status={record.verificationStatus} />
            </button>
          ))}
        </aside>

        <div className="workbench__main">
          <RecordCard record={selectedRecord} />

          <Phase0DraftEditor
            record={selectedRecord}
            draft={selectedDraft}
            draftCount={draftCount}
            onCreate={() => createDraft(selectedRecord.id)}
            onChange={updateDraft}
            onDelete={() => deleteDraft(selectedRecord.id)}
            onResetDefaults={resetDefaultDrafts}
            onSave={saveProgress}
            hasUnsavedChanges={hasUnsavedChanges}
            lastSavedAt={lastSavedAt}
          />

          <Phase0JudgementCard
            judgement={safetyBoundary}
            record={selectedRecord}
          />
        </div>

        <aside className="workbench__checklist">
          <h3>第一階段完成檢查</h3>
          <ul>
            <li>Starter 已載入 {records.length} 筆原始資訊</li>
            <li>目前有 {draftCount} 筆可編輯整理草稿</li>
            <li>可以建立、編輯、刪除或重設整理草稿</li>
            <li>
              {lastSavedAt
                ? `本頁進度已於 ${lastSavedAt} 儲存`
                : "本頁進度尚未儲存"}
            </li>
            <li>預設先建立 6 筆保守空白草稿</li>
            <li>至少挑 2 個候選判斷由人類質疑或修正</li>
            <li>
              把資料品質問題寫進 observations，並記錄 agent 哪裡不能直接相信
            </li>
          </ul>

          <section className="review-ranking">
            <h4>待人工確認依可信度整理</h4>
            {lastSavedAt ? (
              <ol>
                {savedReviewItems.map((item) => (
                  <li key={item.record.id}>
                    <div>
                      <strong>{item.record.id}</strong>
                      <StatusBadge status={item.record.verificationStatus} />
                    </div>
                    <span>
                      AI 輔助可信度 {item.credibilityHint.score}/100（
                      {item.credibilityHint.level}）
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>儲存本頁進度後，這裡會依可信度排序待人工確認資料。</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/date";
import type { Phase0MessyRecord } from "../phase-0/phase0-types";
import {
  createEmptyV1Draft,
  createV1FlowAssessments,
  createInitialV1Drafts,
  type V1EditableDraft,
  type V1FlowAssessment,
  type V1FlowOutcome,
} from "./v1-flow-model";

const outcomeFilters: Array<{ key: "all" | V1FlowOutcome; label: string }> = [
  { key: "all", label: "全部" },
  { key: "hold_with_reason", label: "暫時不採用" },
  { key: "human_review", label: "需要人工確認" },
  { key: "handoff_draft", label: "可交接草稿" },
];

function outcomeClassName(outcome: V1FlowOutcome) {
  return `v1-outcome v1-outcome--${outcome}`;
}

function countByOutcome(
  assessments: V1FlowAssessment[],
  outcome: V1FlowOutcome,
) {
  return assessments.filter((assessment) => assessment.outcome === outcome)
    .length;
}

type V1DraftField = Exclude<keyof V1EditableDraft, "recordId">;
type EditableOutcome = V1FlowOutcome;

const editableOutcomeOptions: Array<{
  key: EditableOutcome;
  label: string;
  description: string;
}> = [
  {
    key: "human_review",
    label: "需要人工確認",
    description: "仍可整理線索，但下一步先交給人確認。",
  },
  {
    key: "hold_with_reason",
    label: "暫時不採用",
    description: "先保留原文與原因，不放入候選整理。",
  },
  {
    key: "handoff_draft",
    label: "可交接草稿",
    description: "可交給下一位繼續判讀，但仍不是已確認或任務。",
  },
];

function getManualOutcomeLabel(outcome: V1FlowOutcome) {
  return (
    outcomeFilters.find((option) => option.key === outcome)?.label ?? "未判斷"
  );
}

function applyManualOutcome(
  assessment: V1FlowAssessment,
  override: V1FlowOutcome | undefined,
): V1FlowAssessment {
  if (!override) {
    return assessment;
  }

  if (override === "human_review") {
    return {
      ...assessment,
      outcome: override,
      outcomeLabel: "需要人工確認",
      outcomeNote: "這是本頁手動調整：仍可整理線索，但下一步必須先由人確認。",
      logEntries: [
        ...assessment.logEntries,
        "本頁手動調整流程輸出：需要人工確認。",
      ],
    };
  }

  if (override === "hold_with_reason") {
    return {
      ...assessment,
      outcome: override,
      outcomeLabel: "暫時不採用為候選草稿",
      outcomeNote:
        "這是本頁手動調整：先保留原文與原因，不放入候選整理，也不轉成任務。",
      logEntries: [
        ...assessment.logEntries,
        "本頁手動調整流程輸出：暫時不採用。",
      ],
    };
  }

  if (override === "handoff_draft") {
    return {
      ...assessment,
      outcome: override,
      outcomeLabel: "可交接整理草稿",
      outcomeNote:
        "這是本頁手動調整：可以交給下一位協作者繼續判讀，但仍不是已確認資料，也不是任務。",
      logEntries: [
        ...assessment.logEntries,
        "本頁手動調整流程輸出：可交接草稿。",
      ],
    };
  }

  return assessment;
}

export function V1FlowWorkbench({ records }: { records: Phase0MessyRecord[] }) {
  const homeHref = import.meta.env.BASE_URL;
  const assessments = useMemo(
    () => createV1FlowAssessments(records),
    [records],
  );
  const [selectedRecordId, setSelectedRecordId] = useState(
    records[0]?.id ?? "",
  );
  const [filter, setFilter] = useState<"all" | V1FlowOutcome>("all");
  const [drafts, setDrafts] = useState<Record<string, V1EditableDraft>>(() =>
    createInitialV1Drafts(records),
  );
  const [savedDrafts, setSavedDrafts] = useState<
    Record<string, V1EditableDraft>
  >(() => createInitialV1Drafts(records));
  const [lastSavedAtByRecord, setLastSavedAtByRecord] = useState<
    Record<string, string>
  >({});
  const [submittedRecordId, setSubmittedRecordId] = useState<
    string | undefined
  >();
  const [editingRecordId, setEditingRecordId] = useState<string | undefined>();
  const [outcomeOverrides, setOutcomeOverrides] = useState<
    Record<string, V1FlowOutcome>
  >({});
  const effectiveAssessments = assessments.map((assessment) =>
    applyManualOutcome(assessment, outcomeOverrides[assessment.recordId]),
  );
  const filteredAssessments =
    filter === "all"
      ? effectiveAssessments
      : effectiveAssessments.filter(
          (assessment) => assessment.outcome === filter,
        );
  const selectedAssessment =
    effectiveAssessments.find(
      (assessment) => assessment.recordId === selectedRecordId,
    ) ?? effectiveAssessments[0];
  const selectedRecord =
    records.find((record) => record.id === selectedAssessment?.recordId) ??
    records[0];
  const selectedDraft =
    drafts[selectedRecord?.id ?? ""] ??
    createEmptyV1Draft(selectedRecord?.id ?? "");
  const savedDraft =
    savedDrafts[selectedRecord?.id ?? ""] ??
    createEmptyV1Draft(selectedRecord?.id ?? "");
  const hasUnsavedDraft =
    JSON.stringify(selectedDraft) !== JSON.stringify(savedDraft);
  const lastSavedAt = lastSavedAtByRecord[selectedRecord?.id ?? ""];
  const selectedOutcomeOverride = outcomeOverrides[selectedRecord?.id ?? ""];
  const isShowingSubmittedDraft =
    submittedRecordId === selectedRecord?.id && Boolean(lastSavedAt);
  const isEditingDraft = editingRecordId === selectedRecord?.id;

  function updateDraft(field: V1DraftField, value: string) {
    setSubmittedRecordId(undefined);
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedRecord.id]: {
        ...(currentDrafts[selectedRecord.id] ??
          createEmptyV1Draft(selectedRecord.id)),
        [field]: value,
      },
    }));
  }

  function saveDraft() {
    setSavedDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedRecord.id]: selectedDraft,
    }));
    setLastSavedAtByRecord((currentTimes) => ({
      ...currentTimes,
      [selectedRecord.id]: new Date().toLocaleTimeString("zh-TW", {
        hour12: false,
      }),
    }));
    setSubmittedRecordId(selectedRecord.id);
    setEditingRecordId(undefined);
  }

  function resetDraft() {
    const emptyDraft = createEmptyV1Draft(selectedRecord.id);
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedRecord.id]: emptyDraft,
    }));
    setSavedDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedRecord.id]: emptyDraft,
    }));
    setLastSavedAtByRecord((currentTimes) => {
      const nextTimes = { ...currentTimes };
      delete nextTimes[selectedRecord.id];
      return nextTimes;
    });
    setSubmittedRecordId(undefined);
    setEditingRecordId(selectedRecord.id);
  }

  function updateOutcomeOverride(nextOutcome: EditableOutcome) {
    setSubmittedRecordId(undefined);
    setOutcomeOverrides((currentOverrides) => ({
      ...currentOverrides,
      [selectedRecord.id]: nextOutcome,
    }));
  }

  function selectRecord(recordId: string) {
    setSelectedRecordId(recordId);
    setEditingRecordId(undefined);
  }

  function clearOutcomeOverride() {
    setSubmittedRecordId(undefined);
    setOutcomeOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides };
      delete nextOverrides[selectedRecord.id];
      return nextOverrides;
    });
  }

  if (!selectedRecord || !selectedAssessment) {
    return (
      <section className="v1-workbench">
        <p>目前沒有 Phase 0 原始資訊可以整理。</p>
      </section>
    );
  }

  return (
    <section className="v1-workbench" aria-label="v1 原始資訊判讀工作台">
      <div className="v1-hero">
        <div>
          <p className="eyebrow">v1 / 原始資訊判讀工作台</p>
          <h2>整理不是確認</h2>
          <p>
            這個畫面根據 `docs/flow.md` 實作：從 Phase 0
            原始資訊開始，由整理者在本頁草稿中分開填寫判讀內容，並保留不可自動處理的停止點。
          </p>
          <p className="v1-hero__warning">
            所有輸出都不是已確認資料，也不是任務。
          </p>
        </div>
        <a href={homeHref} className="v1-hero__link">
          回到 Phase 0
        </a>
      </div>

      <div className="v1-summary" aria-label="v1 流程輸出統計">
        <div>
          <span>{records.length}</span>
          <p>Phase 0 原始資訊</p>
        </div>
        <div>
          <span>
            {countByOutcome(effectiveAssessments, "hold_with_reason")}
          </span>
          <p>暫時不採用為候選草稿</p>
        </div>
        <div>
          <span>{countByOutcome(effectiveAssessments, "human_review")}</span>
          <p>需要人工確認</p>
        </div>
        <div>
          <span>{countByOutcome(effectiveAssessments, "handoff_draft")}</span>
          <p>可交接整理草稿</p>
        </div>
      </div>

      <div className="v1-filter" aria-label="篩選流程輸出">
        {outcomeFilters.map((option) => (
          <button
            className={filter === option.key ? "active" : ""}
            key={option.key}
            type="button"
            onClick={() => setFilter(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="v1-layout">
        <aside className="v1-queue" aria-label="選擇原始資訊">
          {filteredAssessments.map((assessment) => (
            <button
              className={
                assessment.recordId === selectedRecord.id ? "active" : ""
              }
              key={assessment.recordId}
              type="button"
              onClick={() => selectRecord(assessment.recordId)}
            >
              <span>{assessment.recordId}</span>
              <strong>{assessment.outcomeLabel}</strong>
              {lastSavedAtByRecord[assessment.recordId] ? (
                <em>已交出</em>
              ) : null}
            </button>
          ))}
        </aside>

        <article className="v1-detail">
          <header className="v1-detail__header">
            <div>
              <p className="eyebrow">Phase 0 原始資訊</p>
              <h3>{selectedRecord.id}</h3>
            </div>
            <span className={outcomeClassName(selectedAssessment.outcome)}>
              {selectedAssessment.outcomeLabel}
            </span>
          </header>

          <p className="v1-raw-text">{selectedRecord.rawText}</p>

          <div className="v1-meta">
            <SourceLabel sourceType={selectedRecord.sourceType} />
            <StatusBadge status={selectedRecord.verificationStatus} />
            <span>更新：{formatDateTime(selectedRecord.updatedAt)}</span>
          </div>

          {!isEditingDraft ? (
            <section className="v1-handoff-page" aria-label="v1 草稿簡易頁">
              <div>
                <p className="eyebrow">
                  {isShowingSubmittedDraft ? "草稿已交出" : "尚未交出草稿"}
                </p>
                <h4>{selectedRecord.id} 簡易頁面</h4>
              </div>
              <p>
                {isShowingSubmittedDraft
                  ? "這是本頁保存後的交接摘要，不是已確認資料，也不是任務或行動建議。"
                  : "按下編輯草稿後，才會進入可編輯頁面；目前不代表已確認資料或任務。"}
              </p>
              <dl className="v1-handoff-summary">
                <div>
                  <dt>流程狀態</dt>
                  <dd>{selectedAssessment.outcomeLabel}</dd>
                </div>
                <div>
                  <dt>{isShowingSubmittedDraft ? "保存時間" : "草稿狀態"}</dt>
                  <dd>{isShowingSubmittedDraft ? lastSavedAt : "尚未保存"}</dd>
                </div>
              </dl>
              <div className="v1-handoff-notes">
                <section>
                  <h5>原文線索補充</h5>
                  <p>{savedDraft.rawSignalNote || "未填寫"}</p>
                </section>
                <section>
                  <h5>整理者判斷</h5>
                  <p>{savedDraft.organizerJudgementNote || "未填寫"}</p>
                </section>
                <section>
                  <h5>仍待確認</h5>
                  <p>{savedDraft.confirmationNote || "未填寫"}</p>
                </section>
                <section>
                  <h5>交接提醒</h5>
                  <p>{savedDraft.handoffNote || "未填寫"}</p>
                </section>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRecordId(undefined);
                  setEditingRecordId(selectedRecord.id);
                }}
              >
                編輯草稿
              </button>
            </section>
          ) : (
            <>
              <section className="v1-stop-panel">
                <h4>不能自動處理</h4>
                <p>{selectedAssessment.outcomeNote}</p>
                <ul>
                  {selectedAssessment.cannotAutoDecide.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="v1-edit-panel" aria-label="v1 可編輯整理草稿">
                <div className="v1-edit-panel__header">
                  <div>
                    <p className="eyebrow">可編輯整理草稿</p>
                    <h4>{selectedRecord.id} 本頁草稿</h4>
                  </div>
                  <span>{hasUnsavedDraft ? "尚未保存" : "已同步"}</span>
                </div>
                <p>
                  這些欄位只修改本頁整理草稿，不會改原始資訊，也不代表已確認。
                </p>
                <fieldset className="v1-outcome-editor">
                  <legend>流程輸出調整</legend>
                  <p>
                    可以在「需要人工確認」「暫時不採用」「可交接草稿」之間交換；
                    這只是本頁判斷，不是查核結果。
                  </p>
                  <div>
                    {editableOutcomeOptions.map((option) => (
                      <label key={option.key}>
                        <input
                          type="radio"
                          name={`v1-outcome-${selectedRecord.id}`}
                          checked={selectedAssessment.outcome === option.key}
                          onChange={() => updateOutcomeOverride(option.key)}
                        />
                        <span>
                          <strong>{option.label}</strong>
                          {option.description}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={clearOutcomeOverride}>
                    回復流程預設
                  </button>
                  <p className="v1-outcome-editor__state">
                    {selectedOutcomeOverride
                      ? `目前是本頁手動調整：${getManualOutcomeLabel(selectedOutcomeOverride)}。`
                      : `目前使用流程預設：${selectedAssessment.outcomeLabel}。`}
                  </p>
                </fieldset>
                <div className="v1-draft-form">
                  <label>
                    原文線索補充
                    <textarea
                      aria-label="v1 原文線索補充"
                      rows={3}
                      value={selectedDraft.rawSignalNote}
                      onChange={(event) =>
                        updateDraft("rawSignalNote", event.target.value)
                      }
                      placeholder="只摘錄原文看得到的線索，例如時間、來源、數量或原文中的不確定詞。"
                    />
                  </label>
                  <label>
                    整理者判斷
                    <textarea
                      aria-label="v1 整理者判斷"
                      rows={3}
                      value={selectedDraft.organizerJudgementNote}
                      onChange={(event) =>
                        updateDraft(
                          "organizerJudgementNote",
                          event.target.value,
                        )
                      }
                      placeholder="寫下你為什麼這樣判斷，避免把推測寫成事實。"
                    />
                  </label>
                  <label>
                    仍待確認
                    <textarea
                      aria-label="v1 仍待確認"
                      rows={3}
                      value={selectedDraft.confirmationNote}
                      onChange={(event) =>
                        updateDraft("confirmationNote", event.target.value)
                      }
                      placeholder="列出下一位協作者要先確認的來源、時間、地點、安全或同意問題。"
                    />
                  </label>
                  <label>
                    交接提醒
                    <textarea
                      aria-label="v1 交接提醒"
                      rows={3}
                      value={selectedDraft.handoffNote}
                      onChange={(event) =>
                        updateDraft("handoffNote", event.target.value)
                      }
                      placeholder="提醒下一位：這不是已確認資料，也不是任務或行動建議。"
                    />
                  </label>
                </div>
                <div className="v1-edit-panel__actions">
                  <button type="button" onClick={saveDraft}>
                    保存並交出草稿
                  </button>
                  <button type="button" onClick={resetDraft}>
                    清空這筆草稿
                  </button>
                </div>
                <p className="v1-edit-panel__state">
                  {hasUnsavedDraft
                    ? "這筆草稿有尚未保存的修改。"
                    : lastSavedAt
                      ? `這筆草稿已於 ${lastSavedAt} 保存到本頁狀態。`
                      : "這筆草稿尚未填寫或保存。"}
                </p>
              </section>
            </>
          )}
        </article>

        <aside className="v1-log" aria-label="判斷紀錄">
          <h3>判斷紀錄</h3>
          <ol>
            {selectedAssessment.logEntries.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
            {lastSavedAt ? (
              <li>{`${selectedRecord.id} 本頁草稿已於 ${lastSavedAt} 保存。`}</li>
            ) : null}
          </ol>
          <p>
            這些紀錄只描述流程判斷，不能取代人工確認，也不是救災、派工或行動建議。
          </p>
        </aside>
      </div>
    </section>
  );
}

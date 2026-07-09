import type { Phase0MessyRecord } from "./phase0-types";
import type {
  Phase0DraftTopic,
  Phase0EditableDraft,
} from "./phase0-draft-model";
import { createPhase0DraftCredibilityHint } from "./phase0-heuristics";

const topicOptions: Phase0DraftTopic[] = [
  "未判斷",
  "物資",
  "人數",
  "集合點",
  "求助",
  "其他",
];

export function Phase0DraftEditor({
  record,
  draft,
  draftCount,
  onCreate,
  onChange,
  onDelete,
  onResetDefaults,
  onSave,
  hasUnsavedChanges,
  lastSavedAt,
}: {
  record: Phase0MessyRecord;
  draft: Phase0EditableDraft | undefined;
  draftCount: number;
  onCreate: () => void;
  onChange: (draft: Phase0EditableDraft) => void;
  onDelete: () => void;
  onResetDefaults: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  lastSavedAt: string | undefined;
}) {
  const credibilityHint = draft
    ? createPhase0DraftCredibilityHint(record, draft)
    : undefined;

  function toggleTopic(topic: Phase0DraftTopic, checked: boolean) {
    if (!draft) {
      return;
    }

    if (topic === "未判斷" && checked) {
      onChange({ ...draft, topics: ["未判斷"], contentByTopic: {} });
      return;
    }

    const nextTopics = checked
      ? [
          ...new Set([
            ...draft.topics.filter((item) => item !== "未判斷"),
            topic,
          ]),
        ]
      : draft.topics.filter((item) => item !== topic);

    onChange({
      ...draft,
      topics: nextTopics.length > 0 ? nextTopics : ["未判斷"],
    });
  }

  function updateTopicContent(topic: Phase0DraftTopic, value: string) {
    if (!draft) {
      return;
    }

    onChange({
      ...draft,
      contentByTopic: {
        ...draft.contentByTopic,
        [topic]: value,
      },
    });
  }

  return (
    <article className="draft-editor">
      <div className="draft-editor__header">
        <div>
          <p className="eyebrow">可編輯整理草稿</p>
          <h3>{draft ? `${record.id} 草稿` : "這筆尚未建立草稿"}</h3>
        </div>
        <span>{draftCount} 筆草稿</span>
      </div>

      <p className="draft-editor__note">
        草稿只存在目前頁面，重新整理後會回到保守預設。請只寫原文可看出的內容，
        不要把待確認資訊改成已確認。
      </p>

      {draft ? (
        <form className="draft-form">
          <fieldset className="draft-form__checkboxes">
            <legend>統整類型</legend>
            <div>
              {topicOptions.map((topic) => (
                <label key={topic}>
                  <input
                    type="checkbox"
                    checked={draft.topics.includes(topic)}
                    onChange={(event) =>
                      toggleTopic(topic, event.target.checked)
                    }
                  />
                  {topic}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="draft-form__content">
            <legend>內容</legend>
            {draft.topics.map((topic) => (
              <label key={topic}>
                {topic}：
                <textarea
                  aria-label={`${topic}內容`}
                  rows={3}
                  value={draft.contentByTopic[topic] ?? ""}
                  onChange={(event) =>
                    updateTopicContent(topic, event.target.value)
                  }
                  placeholder={`填寫${topic}相關內容，仍需人工確認。`}
                />
              </label>
            ))}
          </fieldset>

          <section className="draft-form__credibility">
            <h4>可信度</h4>
            <div className="credibility-hint" aria-label="AI 輔助可信度">
              <div>
                <strong>{credibilityHint?.score ?? 0}</strong>
                <span>/100</span>
              </div>
              <p>
                AI 輔助可信度：{credibilityHint?.level ?? "低"}。
                {credibilityHint?.warning}
              </p>
              <ul>
                {credibilityHint?.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </section>

          <div className="draft-editor__actions">
            <button type="button" onClick={onSave}>
              儲存本頁進度
            </button>
            <button type="button" onClick={onDelete}>
              刪除這筆草稿
            </button>
            <button type="button" onClick={onResetDefaults}>
              重設 6 筆預設草稿
            </button>
          </div>

          <p className="draft-editor__save-state">
            {hasUnsavedChanges
              ? "有尚未儲存的草稿變更。"
              : lastSavedAt
                ? `已儲存本頁進度：${lastSavedAt}`
                : "目前是預設草稿，尚未儲存本頁進度。"}
          </p>
        </form>
      ) : (
        <div className="draft-editor__empty">
          <p>這筆原始資訊還沒有整理草稿。建立後可以在同一頁直接修改。</p>
          <div className="draft-editor__actions">
            <button type="button" onClick={onCreate}>
              建立這筆草稿
            </button>
            <button type="button" onClick={onSave}>
              儲存本頁進度
            </button>
            <button type="button" onClick={onResetDefaults}>
              重設 6 筆預設草稿
            </button>
          </div>
          <p className="draft-editor__save-state">
            {hasUnsavedChanges
              ? "有尚未儲存的草稿變更。"
              : lastSavedAt
                ? `已儲存本頁進度：${lastSavedAt}`
                : "目前是預設草稿，尚未儲存本頁進度。"}
          </p>
        </div>
      )}
    </article>
  );
}

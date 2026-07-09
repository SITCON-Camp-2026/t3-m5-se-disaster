import { SourceLabel } from "../../components/SourceLabel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDateTime } from "../../lib/date";
import { findPhase0AccuracyIssues } from "./phase0-heuristics";
import type { Phase0MessyRecord } from "./phase0-types";

export function Phase0RawInfoPanel({
  records,
  selectedRecordId,
  onSelect,
}: {
  records: Phase0MessyRecord[];
  selectedRecordId: string;
  onSelect: (recordId: string) => void;
}) {
  return (
    <div className="phase0-raw">
      <div className="panel__header">
        <div>
          <h2>原始資訊</h2>
          <p>這些還不是整理後資料，不能直接當成行動依據。</p>
        </div>
        <p>{records.length} 筆資料</p>
      </div>

      <div className="grid">
        {records.map((record) => {
          const issues = findPhase0AccuracyIssues(record);

          return (
            <article
              className={`record-card ${record.id === selectedRecordId ? "record-card--selected" : ""}`}
              key={record.id}
            >
              <div className="record-card__header">
                <h3>{record.id}</h3>
                <StatusBadge status={record.verificationStatus} />
              </div>
              <p>{record.rawText}</p>
              <div className="record-card__meta">
                <SourceLabel sourceType={record.sourceType} />
                <span>更新：{formatDateTime(record.updatedAt)}</span>
              </div>
              <section className="accuracy-issues">
                <h4>不準確或待確認訊號</h4>
                <ul>
                  {issues.slice(0, 3).map((issue) => (
                    <li key={issue.label}>{issue.label}</li>
                  ))}
                </ul>
              </section>
              <button type="button" onClick={() => onSelect(record.id)}>
                送到整理工作台
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

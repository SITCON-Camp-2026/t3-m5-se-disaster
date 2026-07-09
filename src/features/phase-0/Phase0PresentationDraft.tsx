import { StatusBadge } from "../../components/StatusBadge";
import type { Phase0MessyRecord } from "./phase0-types";

type PresentationSection = {
  title: string;
  description: string;
  keywords: string[];
  reviewQuestion: string;
};

const presentationSections: PresentationSection[] = [
  {
    title: "物資統整",
    description: "先把原文中提到的物資狀態集中看，不代表庫存已確認。",
    keywords: ["雨鞋", "飲用水", "二手衣物", "鏟子", "藥品"],
    reviewQuestion: "需要人工確認：數量、尺寸、是否仍有效、是否還收或還缺。",
  },
  {
    title: "人數統整",
    description: "先把人力、人數或派人限制集中看，不代表可以直接派工。",
    keywords: ["十幾個人", "清泥", "清淤志工", "不要再派人", "支援水電"],
    reviewQuestion:
      "需要人工確認：需要幾人、是否過量、是否有技能條件與現場安全限制。",
  },
  {
    title: "集合點整合",
    description: "先把可能集合點與服務台線索集中看，不代表地點安全或可前往。",
    keywords: ["集合點", "活動中心", "學校側門", "東側出口", "服務台"],
    reviewQuestion:
      "需要人工確認：地點是否開放、是否安全、誰可以前往、公告是否同步。",
  },
];

function recordsForSection(records: Phase0MessyRecord[], keywords: string[]) {
  return records.filter((record) =>
    keywords.some((keyword) => record.rawText.includes(keyword)),
  );
}

export function Phase0PresentationDraft({
  records,
}: {
  records: Phase0MessyRecord[];
}) {
  return (
    <section
      className="presentation-draft"
      aria-labelledby="presentation-title"
    >
      <div className="presentation-draft__header">
        <div>
          <p className="eyebrow">想呈現的內容</p>
          <h3 id="presentation-title">候選統整草稿</h3>
        </div>
        <span>只來自原始資訊</span>
      </div>

      <p className="presentation-draft__note">
        這三塊是目前想在整理工作台上看的方向：物資統整、人數統整、集合點整合。
        下面只列出原文線索，不把 `needs_review` 或 `unverified` 當成已確認資訊。
      </p>

      <div className="presentation-draft__grid">
        {presentationSections.map((section) => {
          const matchingRecords = recordsForSection(records, section.keywords);

          return (
            <article className="presentation-card" key={section.title}>
              <div className="presentation-card__title">
                <h4>{section.title}</h4>
                <span>{matchingRecords.length} 筆線索</span>
              </div>
              <p>{section.description}</p>

              <ul className="presentation-card__items">
                {matchingRecords.map((record) => (
                  <li key={record.id}>
                    <div className="presentation-card__meta">
                      <strong>{record.id}</strong>
                      <StatusBadge status={record.verificationStatus} />
                    </div>
                    <span>{record.rawText}</span>
                  </li>
                ))}
              </ul>

              <p className="presentation-card__review">
                {section.reviewQuestion}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

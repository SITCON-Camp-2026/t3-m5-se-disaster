import type {
  Phase0EditableDraft,
  Phase0DraftTopic,
} from "./phase0-draft-model";
import type {
  Phase0AccuracyIssue,
  Phase0CredibilityHint,
  Phase0JudgementDraft,
  Phase0MessyRecord,
} from "./phase0-types";

const unclearLocationWords = [
  "後方",
  "後面",
  "那邊",
  "附近",
  "往溪邊方向",
  "第二排",
];
const staleTimeWords = ["昨天", "下午", "中午前", "哪一天", "沒更新", "今天"];
const conflictWords = [
  "但",
  "不知道",
  "不確定",
  "疑似",
  "留言有人說",
  "另一位志工說",
  "無法確認",
  "尚未確認",
  "尚未看到",
];
const secondHandWords = [
  "有人說",
  "有人在群組說",
  "社群貼文說",
  "代一位",
  "轉述",
  "家屬來電",
  "家屬不在現場",
];
const consentWords = ["同意公開", "完整地址"];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function scoreSourceType(sourceType: string) {
  if (sourceType === "field_report" || sourceType === "volunteer_update") {
    return 6;
  }

  if (sourceType === "official_notice") {
    return 4;
  }

  if (sourceType === "phone_call") {
    return 2;
  }

  if (sourceType === "social_post") {
    return 1;
  }

  return 0;
}

function scoreRawTextSignals(text: string) {
  let score = 0;

  if (/\d{1,2}:\d{2}/.test(text)) {
    score += 8;
  }

  if (/[0-9０-９]+|十幾|約/.test(text)) {
    score += 6;
  }

  if (text.includes("現場") || text.includes("值守志工確認")) {
    score += 6;
  }

  if (text.includes("下一次") || text.includes("預計")) {
    score += 4;
  }

  return score;
}

export function findPhase0AccuracyIssues(
  record: Phase0MessyRecord,
): Phase0AccuracyIssue[] {
  const issues: Phase0AccuracyIssue[] = [];
  const text = record.rawText;

  if (record.verificationStatus !== "verified") {
    issues.push({
      label: "查核狀態不足",
      detail: `目前狀態是 ${record.verificationStatus}，只能當成待整理線索。`,
    });
  }

  if (includesAny(text, unclearLocationWords)) {
    issues.push({
      label: "地點不夠精準",
      detail: "原文有相對位置或模糊描述，不能直接變成可派工地點。",
    });
  }

  if (includesAny(text, staleTimeWords)) {
    issues.push({
      label: "時間可能過期",
      detail: "原文提到昨天、下午、中午前或未更新，現況需要重新確認。",
    });
  }

  if (includesAny(text, conflictWords)) {
    issues.push({
      label: "內容有衝突或不確定",
      detail: "原文自己留下疑問、衝突說法或尚未同步確認的訊號。",
    });
  }

  if (includesAny(text, secondHandWords)) {
    issues.push({
      label: "不是當事人直接確認",
      detail: "資訊來自轉述、社群或非現場者，不能直接代表當事人需求。",
    });
  }

  if (includesAny(text, consentWords)) {
    issues.push({
      label: "隱私與公開同意未確認",
      detail: "原文提到完整地址或公開同意，整理時要避免補出個資。",
    });
  }

  if (issues.length === 0) {
    issues.push({
      label: "仍需人工檢查",
      detail: "目前沒有足夠理由把原始資訊改寫成已確認事實。",
    });
  }

  return issues;
}

export function createPhase0CredibilityHint(
  record: Phase0MessyRecord,
): Phase0CredibilityHint {
  const issues = findPhase0AccuracyIssues(record);
  const statusScore =
    record.verificationStatus === "verified"
      ? 30
      : record.verificationStatus === "needs_review"
        ? 10
        : record.verificationStatus === "unverified"
          ? 4
          : 0;
  const score = Math.min(
    65,
    statusScore +
      scoreSourceType(record.sourceType) +
      scoreRawTextSignals(record.rawText),
  );

  return {
    score,
    level: score >= 50 ? "中" : score >= 30 ? "偏低" : "低",
    reasons: issues.slice(0, 3).map((issue) => issue.label),
    warning: "AI 輔助估算，不是事實查核結果，仍需人工確認。",
  };
}

function hasDraftContent(draft: Phase0EditableDraft, topic: Phase0DraftTopic) {
  return Boolean(draft.contentByTopic[topic]?.trim());
}

export function createPhase0DraftCredibilityHint(
  record: Phase0MessyRecord,
  draft: Phase0EditableDraft,
): Phase0CredibilityHint {
  const baseHint = createPhase0CredibilityHint(record);
  const selectedTopics = draft.topics.filter((topic) => topic !== "未判斷");
  const filledTopicCount = draft.topics.filter((topic) =>
    hasDraftContent(draft, topic),
  ).length;
  const draftBoost =
    Math.min(selectedTopics.length * 2, 6) + Math.min(filledTopicCount * 6, 18);
  const score = Math.min(75, baseHint.score + draftBoost);
  const draftReasons: string[] = [];

  if (selectedTopics.length > 0) {
    draftReasons.push(`已選擇 ${selectedTopics.length} 個統整類型`);
  }

  if (filledTopicCount > 0) {
    draftReasons.push(`已補充 ${filledTopicCount} 個分項內容`);
  }

  return {
    score,
    level: score >= 50 ? "中" : score >= 30 ? "偏低" : "低",
    reasons: [...draftReasons, ...baseHint.reasons].slice(0, 5),
    warning:
      "AI 依原始資訊與目前草稿重新估算，不是事實查核結果，仍需人工確認。",
  };
}

// This is a safety-boundary scaffold, not an answer engine.
export function createPhase0Judgement(
  record: Phase0MessyRecord,
): Phase0JudgementDraft {
  const isVerified = record.verificationStatus === "verified";
  const issues = findPhase0AccuracyIssues(record);

  return {
    messyRecordId: record.id,
    possibleKind: "unknown",
    confidence: "low",
    evidence: issues.map((issue) => `${issue.label}：${issue.detail}`),
    blockers: isVerified
      ? ["仍需確認這筆資訊適合進入哪個後續流程。"]
      : [
          "目前不是已確認資訊，不能直接行動或當成事實發布。",
          "上方標示只來自原文詞句與查核狀態，不代表已完成事實查核。",
        ],
    suggestedNextStep: isVerified ? "keep_raw" : "send_to_human_review",
    unsafeToActDirectly: true,
  };
}

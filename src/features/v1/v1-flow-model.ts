import { findPhase0AccuracyIssues } from "../phase-0/phase0-heuristics";
import type {
  Phase0AccuracyIssue,
  Phase0MessyRecord,
} from "../phase-0/phase0-types";

export type V1FlowOutcome =
  "handoff_draft" | "human_review" | "hold_with_reason";

export type V1FlowAssessment = {
  recordId: string;
  reviewReasons: Phase0AccuracyIssue[];
  cannotAutoDecide: string[];
  outcome: V1FlowOutcome;
  outcomeLabel: string;
  outcomeNote: string;
  logEntries: string[];
};

export type V1EditableDraft = {
  recordId: string;
  rawSignalNote: string;
  organizerJudgementNote: string;
  confirmationNote: string;
  handoffNote: string;
};

const directActionWords = [
  "直接過去",
  "派人",
  "集合點",
  "道路封閉",
  "可以支援",
  "藥品",
  "完整地址",
];

const consentAndSafetyWords = [
  "淹水",
  "住家",
  "長者",
  "同意公開",
  "家屬",
  "不在現場",
  "無法確認",
];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function collectCannotAutoDecide(record: Phase0MessyRecord) {
  const decisions = [
    "不能由 AI 判斷資訊是真是假。",
    "不能由 AI 轉成派工、出發或處理優先順序。",
  ];

  if (record.verificationStatus !== "verified") {
    decisions.push("查核狀態未確認，不能改寫成 confirmed / verified。");
  }

  if (includesAny(record.rawText, directActionWords)) {
    decisions.push("看起來像任務或集合點的內容仍不能自動變成任務。");
  }

  if (includesAny(record.rawText, consentAndSafetyWords)) {
    decisions.push("地點安全、個人狀況、當事人同意必須由人確認。");
  }

  return decisions;
}

function decideOutcome(
  record: Phase0MessyRecord,
  reviewReasons: Phase0AccuracyIssue[],
): Pick<V1FlowAssessment, "outcome" | "outcomeLabel" | "outcomeNote"> {
  const hasCriticalStop =
    includesAny(record.rawText, directActionWords) ||
    includesAny(record.rawText, consentAndSafetyWords) ||
    record.verificationStatus === "unverified";

  if (hasCriticalStop) {
    return {
      outcome: "hold_with_reason",
      outcomeLabel: "暫時不採用為候選草稿",
      outcomeNote:
        "保留原文與原因，先請人確認來源、時間、地點、安全或同意，不轉成任務。",
    };
  }

  if (reviewReasons.length > 0 || record.verificationStatus !== "verified") {
    return {
      outcome: "human_review",
      outcomeLabel: "需要人工確認",
      outcomeNote: "可以整理線索，但輸出仍是待確認草稿，不是已確認資料。",
    };
  }

  return {
    outcome: "handoff_draft",
    outcomeLabel: "可交接整理草稿",
    outcomeNote: "仍需保留原文、整理者判斷與待確認欄位，不代表可以直接行動。",
  };
}

export function createV1FlowAssessment(
  record: Phase0MessyRecord,
): V1FlowAssessment {
  const reviewReasons = findPhase0AccuracyIssues(record);
  const outcome = decideOutcome(record, reviewReasons);
  const cannotAutoDecide = collectCannotAutoDecide(record);

  return {
    recordId: record.id,
    reviewReasons,
    cannotAutoDecide,
    ...outcome,
    logEntries: [
      `讀取 ${record.id} 原文與查核狀態。`,
      `標示 ${reviewReasons.length} 個人工確認原因。`,
      `輸出狀態：${outcome.outcomeLabel}。`,
    ],
  };
}

export function createV1FlowAssessments(records: Phase0MessyRecord[]) {
  return records.map(createV1FlowAssessment);
}

export function createEmptyV1Draft(recordId: string): V1EditableDraft {
  return {
    recordId,
    rawSignalNote: "",
    organizerJudgementNote: "",
    confirmationNote: "",
    handoffNote: "",
  };
}

export function createInitialV1Drafts(records: Phase0MessyRecord[]) {
  return Object.fromEntries(
    records.map((record) => [record.id, createEmptyV1Draft(record.id)]),
  );
}

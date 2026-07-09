import type { Phase0MessyRecord } from "./phase0-types";

export type Phase0DraftTopic =
  "未判斷" | "物資" | "人數" | "集合點" | "求助" | "其他";

export type Phase0EditableDraft = {
  recordId: string;
  topics: Phase0DraftTopic[];
  contentByTopic: Partial<Record<Phase0DraftTopic, string>>;
};

export function createEmptyDraft(recordId: string): Phase0EditableDraft {
  return {
    recordId,
    topics: ["未判斷"],
    contentByTopic: {},
  };
}

export function createInitialDrafts(records: Phase0MessyRecord[]) {
  return Object.fromEntries(
    records
      .slice(0, 6)
      .map((record) => [record.id, createEmptyDraft(record.id)]),
  );
}

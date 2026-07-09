import { describe, expect, it } from "vitest";
import messyReports from "../src/fixtures/phase-0/messy-reports.json";
import {
  createPhase0CredibilityHint,
  createPhase0DraftCredibilityHint,
  createPhase0Judgement,
  findPhase0AccuracyIssues,
} from "../src/features/phase-0/phase0-heuristics";

describe("phase 0 heuristics", () => {
  it("loads the current phase 0 messy data", () => {
    expect(messyReports).toHaveLength(12);
    expect(messyReports.map((record) => record.id)).toEqual(
      Array.from(
        { length: 12 },
        (_, index) => `M-${String(index + 1).padStart(3, "0")}`,
      ),
    );
  });

  it("creates conservative safety placeholders for all records", () => {
    const judgements = messyReports.map(createPhase0Judgement);

    expect(judgements).toHaveLength(messyReports.length);
    expect(
      judgements.filter((judgement) => judgement.unsafeToActDirectly),
    ).toHaveLength(messyReports.length);
    expect(
      judgements.filter((judgement) => judgement.possibleKind === "unknown"),
    ).toHaveLength(messyReports.length);
    expect(
      judgements.filter((judgement) => judgement.confidence === "low"),
    ).toHaveLength(messyReports.length);
  });

  it("does not treat review-needed records as confirmed facts", () => {
    const judgement = createPhase0Judgement(messyReports[9]);

    expect(messyReports[9].verificationStatus).toBe("needs_review");
    expect(judgement.unsafeToActDirectly).toBe(true);
    expect(judgement.evidence.join(" ")).not.toContain("verified");
  });

  it("does not infer candidate kind from the starter text", () => {
    const judgement = createPhase0Judgement(messyReports[10]);

    expect(judgement.possibleKind).toBe("unknown");
    expect(judgement.suggestedNextStep).toBe("send_to_human_review");
  });

  it("surfaces missing accuracy signals without confirming the content", () => {
    const issues = findPhase0AccuracyIssues(messyReports[10]);

    expect(issues.map((issue) => issue.label)).toContain("地點不夠精準");
    expect(issues.map((issue) => issue.label)).toContain("不是當事人直接確認");
    expect(issues.map((issue) => issue.label)).toContain(
      "隱私與公開同意未確認",
    );
  });

  it("creates conservative credibility hints without confirming records", () => {
    const hint = createPhase0CredibilityHint(messyReports[9]);

    expect(hint.score).toBeGreaterThan(0);
    expect(hint.score).toBeLessThanOrEqual(65);
    expect(["低", "偏低", "中"]).toContain(hint.level);
    expect(hint.warning).toContain("不是事實查核結果");
  });

  it("starts credibility scoring from zero when there are no usable signals", () => {
    const hint = createPhase0CredibilityHint({
      id: "M-test",
      rawText: "內容待補。",
      sourceType: "unknown",
      verificationStatus: "unknown",
      updatedAt: "2026-07-20T00:00:00+08:00",
    });

    expect(hint.score).toBe(0);
    expect(hint.level).toBe("低");
  });

  it("reanalyzes credibility when learners add draft content", () => {
    const baseHint = createPhase0CredibilityHint(messyReports[9]);
    const draftHint = createPhase0DraftCredibilityHint(messyReports[9], {
      recordId: messyReports[9].id,
      topics: ["物資", "集合點"],
      contentByTopic: {
        物資: "雨鞋約剩 12 雙，但仍需人工確認。",
        集合點: "活動中心可能不是一般物資集合點。",
      },
    });

    expect(draftHint.score).toBeGreaterThan(baseHint.score);
    expect(draftHint.score).toBeLessThanOrEqual(75);
    expect(draftHint.reasons).toContain("已補充 2 個分項內容");
    expect(draftHint.warning).toContain("目前草稿重新估算");
  });
});

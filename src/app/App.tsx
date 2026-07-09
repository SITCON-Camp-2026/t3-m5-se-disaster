import { useState } from "react";
import messyReports from "../fixtures/phase-0/messy-reports.json";
import { EmptyState } from "../components/EmptyState";
import { Phase0RawInfoPanel } from "../features/phase-0/Phase0RawInfoPanel";
import { Phase0Workbench } from "../features/phase-0/Phase0Workbench";
import type { Phase0MessyRecord } from "../features/phase-0/phase0-types";
import { V1FlowWorkbench } from "../features/v1/V1FlowWorkbench";

type TabKey = "raw" | "workbench";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "raw", label: "原始資訊" },
  { key: "workbench", label: "整理工作台" },
];

const phase0Records = messyReports satisfies Phase0MessyRecord[];
const appBase = import.meta.env.BASE_URL;

function isV1Path() {
  const normalizedPath = window.location.pathname
    .replace(appBase, "/")
    .replace(/\/+$/, "/");

  return normalizedPath === "/v1/";
}

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("raw");
  const [selectedRecordId, setSelectedRecordId] = useState(
    phase0Records[0]?.id ?? "",
  );
  const showV1 = isV1Path();

  function selectForWorkbench(recordId: string) {
    setSelectedRecordId(recordId);
    setActiveTab("workbench");
  }

  if (showV1) {
    return (
      <main className="layout layout--v1">
        <V1FlowWorkbench records={phase0Records} />
      </main>
    );
  }

  return (
    <main className="layout">
      <header className="hero">
        <div>
          <p className="eyebrow">SITCON Camp 2026</p>
          <h1>災害資訊整理工作台</h1>
          <p>
            第一階段先用 coding agent
            做出可展示的前端原型，再從成果中看見資料品質、角色、狀態與來源的限制。
          </p>
        </div>
        <div className="cat-mark" aria-hidden="true">
          <span className="cat-mark__ear cat-mark__ear--left" />
          <span className="cat-mark__ear cat-mark__ear--right" />
          <span className="cat-mark__face">
            <span className="cat-mark__eye cat-mark__eye--left" />
            <span className="cat-mark__eye cat-mark__eye--right" />
            <span className="cat-mark__nose" />
            <span className="cat-mark__whisker cat-mark__whisker--left" />
            <span className="cat-mark__whisker cat-mark__whisker--right" />
          </span>
        </div>
      </header>

      <section className="v1-entry" aria-label="v1 入口">
        <div>
          <p className="eyebrow">Release 02 Flow</p>
          <h2>依流程圖查看 v1 原始資訊判讀工作台</h2>
          <p>
            v1 仍只使用 Phase 0
            原始資訊，重點是把「原文」「整理者判斷」「仍待確認」分開，
            並阻止未確認內容被誤讀成任務。
          </p>
        </div>
        <a href={`${appBase}v1/`}>前往 v1</a>
      </section>

      <nav className="tabs" aria-label="第一階段工作區">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="panel">
        {phase0Records.length === 0 ? (
          <EmptyState message="目前沒有資料" />
        ) : activeTab === "raw" ? (
          <Phase0RawInfoPanel
            records={phase0Records}
            selectedRecordId={selectedRecordId}
            onSelect={selectForWorkbench}
          />
        ) : (
          <Phase0Workbench
            records={phase0Records}
            selectedRecordId={selectedRecordId}
            onSelect={setSelectedRecordId}
          />
        )}
      </section>
    </main>
  );
}

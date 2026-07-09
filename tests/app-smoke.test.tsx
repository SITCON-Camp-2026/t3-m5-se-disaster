import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  function renderAt(path: string) {
    window.history.pushState({}, "", path);
    return render(<App />);
  }

  it("renders starter title", () => {
    renderAt("/");
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("keeps the home page focused on phase 0 tabs", () => {
    renderAt("/");

    expect(
      screen.getByRole("button", { name: "原始資訊" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "整理工作台" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "通報" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "地點" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "志工任務" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "人員指派" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "前往 v1" })).toHaveAttribute(
      "href",
      "/v1/",
    );
  });

  it("shows review states in the phase 0 workbench", () => {
    renderAt("/");

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(
      screen.getByText(
        "第一階段的成功不是分類正確，而是把為什麼現在還不能判斷說清楚。",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("待人工確認").length).toBeGreaterThan(0);
    expect(screen.getAllByText("未查核").length).toBeGreaterThan(0);
  });

  it("shows the learner's presentation sections as unconfirmed draft summaries", () => {
    renderAt("/");

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("候選統整草稿")).toBeInTheDocument();
    expect(screen.getByText("物資統整")).toBeInTheDocument();
    expect(screen.getByText("人數統整")).toBeInTheDocument();
    expect(screen.getByText("集合點整合")).toBeInTheDocument();
    expect(screen.getByText("只來自原始資訊")).toBeInTheDocument();
  });

  it("shows accuracy issues on raw records", () => {
    renderAt("/");

    expect(screen.getAllByText("不準確或待確認訊號").length).toBeGreaterThan(0);
    expect(screen.getAllByText("查核狀態不足").length).toBeGreaterThan(0);
  });

  it("lets learners edit, delete, create, and reset draft content", () => {
    renderAt("/");

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("M-001 草稿")).toBeInTheDocument();
    expect(screen.getByText(/目前有 6 筆可編輯整理草稿/)).toBeInTheDocument();
    expect(
      screen.queryByLabelText("為什麼不能直接變成任務"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("下一步")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("人工確認備註")).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "未判斷" })).toBeChecked();

    fireEvent.click(screen.getByRole("checkbox", { name: "物資" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "集合點" }));

    expect(screen.getByRole("checkbox", { name: "物資" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "集合點" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "未判斷" })).not.toBeChecked();

    expect(screen.getByText("物資：")).toBeInTheDocument();
    expect(screen.getByText("集合點：")).toBeInTheDocument();
    expect(screen.getByText("有尚未儲存的草稿變更。")).toBeInTheDocument();
    expect(screen.getByText("待人工確認依可信度整理")).toBeInTheDocument();
    expect(
      screen.getByText("儲存本頁進度後，這裡會依可信度排序待人工確認資料。"),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("物資內容"), {
      target: { value: "先整理雨鞋線索，全部仍需人工確認。" },
    });
    expect(
      screen.getByDisplayValue("先整理雨鞋線索，全部仍需人工確認。"),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("集合點內容"), {
      target: { value: "先整理集合點線索，全部仍需人工確認。" },
    });
    expect(
      screen.getByDisplayValue("先整理集合點線索，全部仍需人工確認。"),
    ).toBeInTheDocument();
    expect(screen.getByText("已補充 2 個分項內容")).toBeInTheDocument();

    expect(screen.queryByLabelText("可信度")).not.toBeInTheDocument();
    expect(screen.getByLabelText("AI 輔助可信度")).toBeInTheDocument();
    expect(screen.getByText(/不是事實查核結果/)).toBeInTheDocument();
    expect(screen.getByText("/100")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "儲存本頁進度" }));
    expect(screen.getAllByText(/已儲存本頁進度/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/AI 輔助可信度 \d+\/100/).length,
    ).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "刪除這筆草稿" }));
    expect(screen.getByText("這筆尚未建立草稿")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "建立這筆草稿" }));
    expect(screen.getByText("M-001 草稿")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /M-007/ }));
    expect(screen.getByText("這筆尚未建立草稿")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重設 6 筆預設草稿" }));
    expect(screen.getByText("目前有 6 筆可編輯整理草稿")).toBeInTheDocument();
  });

  it("renders the v1 flow workbench from /v1/", () => {
    renderAt("/v1/");

    expect(screen.getByText("整理不是確認")).toBeInTheDocument();
    expect(screen.getByText("v1 / 原始資訊判讀工作台")).toBeInTheDocument();
    expect(screen.getByLabelText("v1 流程輸出統計")).toBeInTheDocument();
    expect(screen.getAllByText("Phase 0 原始資訊").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("v1 草稿簡易頁")).toBeInTheDocument();
    expect(screen.getByText("尚未交出草稿")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "編輯草稿" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("v1 可編輯整理草稿"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("v1 原文線索補充")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("v1 整理者判斷")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("v1 仍待確認")).not.toBeInTheDocument();
    expect(screen.getByText("判斷紀錄")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "回到 Phase 0" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("keeps v1 outputs conservative and filterable", () => {
    renderAt("/v1/");

    expect(
      screen.getByText("所有輸出都不是已確認資料，也不是任務。"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("暫時不採用為候選草稿").length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("需要人工確認").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "編輯草稿" }));
    expect(
      screen.getByText("不能由 AI 判斷資訊是真是假。"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "需要人工確認" }));
    expect(screen.getByLabelText("選擇原始資訊")).toBeInTheDocument();
    expect(screen.queryByText("AI 輔助可信度")).not.toBeInTheDocument();
  });

  it("does not show generated v1 judgement lists above the editable draft", () => {
    renderAt("/v1/");

    fireEvent.click(screen.getByRole("button", { name: /M-010/ }));

    expect(
      screen.queryByText("資訊取得方式：volunteer_update"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("查核狀態：needs_review"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("更新時間：2026-07-20T14:35:00+08:00"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("原文有時間、現場回報、數量或下一次更新線索。"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "查核狀態不足：目前狀態是 needs_review，只能當成待整理線索。",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("這筆資訊是否仍有效。")).not.toBeInTheDocument();
    expect(
      screen.queryByText("來源是否為親眼確認、轉述或截圖。"),
    ).not.toBeInTheDocument();
  });

  it("lets learners edit and save v1 handoff draft notes", () => {
    renderAt("/v1/");

    fireEvent.click(screen.getByRole("button", { name: "編輯草稿" }));

    fireEvent.change(screen.getByLabelText("v1 原文線索補充"), {
      target: { value: "原文只有老雜貨店後面，地點仍不精準。" },
    });
    fireEvent.change(screen.getByLabelText("v1 整理者判斷"), {
      target: { value: "只能當成待確認線索，不能變成清泥任務。" },
    });
    fireEvent.change(screen.getByLabelText("v1 仍待確認"), {
      target: { value: "需要確認來源、現況、精確地點與安全性。" },
    });
    fireEvent.change(screen.getByLabelText("v1 交接提醒"), {
      target: { value: "下一位請先人工確認，不要直接派人。" },
    });

    expect(screen.getByText("這筆草稿有尚未保存的修改。")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("只能當成待確認線索，不能變成清泥任務。"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "保存並交出草稿" }));
    expect(screen.getByLabelText("v1 草稿簡易頁")).toBeInTheDocument();
    expect(screen.getByText("M-001 簡易頁面")).toBeInTheDocument();
    expect(screen.getByText("草稿已交出")).toBeInTheDocument();
    expect(
      screen.getByText("原文只有老雜貨店後面，地點仍不精準。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("下一位請先人工確認，不要直接派人。"),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/本頁草稿已於/).length).toBeGreaterThan(0);
    expect(screen.getByText("已交出")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "編輯草稿" }));
    fireEvent.click(screen.getByRole("button", { name: "清空這筆草稿" }));
    expect(screen.getByLabelText("v1 原文線索補充")).toHaveValue("");
    expect(screen.getByText("這筆草稿尚未填寫或保存。")).toBeInTheDocument();
  });

  it("lets learners swap v1 manual outcomes between review, hold, and handoff", () => {
    renderAt("/v1/");

    fireEvent.click(screen.getByRole("button", { name: "編輯草稿" }));

    expect(
      screen.getByText("目前使用流程預設：需要人工確認。"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /暫時不採用/ }));

    expect(
      screen.getByText("目前是本頁手動調整：暫時不採用。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("本頁手動調整流程輸出：暫時不採用。"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/先保留原文與原因，不放入候選整理/).length,
    ).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("radio", { name: /需要人工確認/ }));

    expect(
      screen.getByText("目前是本頁手動調整：需要人工確認。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("本頁手動調整流程輸出：需要人工確認。"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /可交接草稿/ }));

    expect(
      screen.getByText("目前是本頁手動調整：可交接草稿。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("本頁手動調整流程輸出：可交接草稿。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/仍不是已確認資料，也不是任務/),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "回復流程預設" }));
    expect(
      screen.getByText("目前使用流程預設：需要人工確認。"),
    ).toBeInTheDocument();
  });
});

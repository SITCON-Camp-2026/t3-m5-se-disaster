import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/app/App";

describe("App", () => {
  it("renders starter title", () => {
    render(<App />);
    expect(screen.getByText("災害資訊整理工作台")).toBeInTheDocument();
  });

  it("keeps the home page focused on phase 0 tabs", () => {
    render(<App />);

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
  });

  it("shows review states in the phase 0 workbench", () => {
    render(<App />);

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
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "整理工作台" }));

    expect(screen.getByText("候選統整草稿")).toBeInTheDocument();
    expect(screen.getByText("物資統整")).toBeInTheDocument();
    expect(screen.getByText("人數統整")).toBeInTheDocument();
    expect(screen.getByText("集合點整合")).toBeInTheDocument();
    expect(screen.getByText("只來自原始資訊")).toBeInTheDocument();
  });

  it("shows accuracy issues on raw records", () => {
    render(<App />);

    expect(screen.getAllByText("不準確或待確認訊號").length).toBeGreaterThan(0);
    expect(screen.getAllByText("查核狀態不足").length).toBeGreaterThan(0);
  });

  it("lets learners edit, delete, create, and reset draft content", () => {
    render(<App />);

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
});

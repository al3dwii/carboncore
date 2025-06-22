// __tests__/EventTable.test.tsx
import { EventTable } from "@/components/EventTable";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

describe("<EventTable />", () => {
  const row = {
    id: 1,
    project_id: "PROJ-42",
    feature: "cold-starts",
    sku_id: "λ-123",
    region: "us-east-1",
    kwh: 0.12,
    co2: 0.08,
    usd: 0.25,
    created_at: "2025-06-22",
  };

  it("renders every row’s key fields", () => {
    render(<EventTable rows={[row]} />);

    const tr = screen.getByText(row.project_id).closest("tr")!;
    const utils = within(tr);

    expect(utils.getByText(row.project_id)).toBeInTheDocument();
    expect(utils.getByText(row.feature)).toBeInTheDocument();
    expect(utils.getByText(/\$0\.25/)).toBeInTheDocument();
    expect(utils.getByText("0.08 kg")).toBeInTheDocument();
  });

  it("renders **no rows** when rows = []", () => {
    const { container } = render(<EventTable rows={[]} />);
    expect(container.querySelectorAll("tbody tr").length).toBe(0);
  });
});

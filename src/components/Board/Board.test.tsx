// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Board from "./Board";

describe("Board", () => {
  it("renders an SVG board with 121 hex cells", () => {
    const { container } = render(<Board />);

    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();

    const cells = container.querySelectorAll("polygon");
    expect(cells.length).toBe(121);
  });

  it("calls onCellClick when a cell is clicked", () => {
    const onCellClick = vi.fn();
    const { container } = render(<Board onCellClick={onCellClick} />);

    const firstCell = container.querySelector("polygon");
    expect(firstCell).toBeTruthy();

    fireEvent.click(firstCell!);
    expect(onCellClick).toHaveBeenCalledTimes(1);
  });
});

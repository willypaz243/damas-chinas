// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Board from "./Board";
import { GameEngine } from "../../engine/game";
import type { GameConfig } from "../../engine/types";

const defaultConfig: GameConfig = {
  playerCount: 2,
  players: [
    { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
    { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1,
};

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

  it("renders pieces when state is provided", () => {
    const engine = new GameEngine();
    engine.reset(defaultConfig);
    const state = engine.getState();
    
    const { container } = render(<Board state={state} size={800} />);
    
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThan(0);
  });

  it("renders 20 pieces for 2 players (10 each)", () => {
    const engine = new GameEngine();
    engine.reset(defaultConfig);
    const state = engine.getState();
    
    const { container } = render(<Board state={state} size={800} />);
    
    const pieceCircles = container.querySelectorAll("[class*='pieceCircle']");
    expect(pieceCircles.length).toBe(20);
  });
});

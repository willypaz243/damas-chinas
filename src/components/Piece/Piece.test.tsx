import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Piece from "./Piece";

describe("Piece", () => {
  it("renders a circle with the correct color", () => {
    const { container } = render(
      <svg>
        <Piece color="#E74C3C" cx={100} cy={100} r={15} />
      </svg>
    );
    const circle = container.querySelector("circle");
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute("fill")).toBe("#E74C3C");
  });

  it("applies selected style when isSelected is true", () => {
    const { container } = render(
      <svg>
        <Piece color="#3498DB" cx={100} cy={100} r={15} isSelected />
      </svg>
    );
    const selectedCircle = container.querySelector("[class*='selected']");
    expect(selectedCircle).toBeTruthy();
  });

  it("renders with different colors for different players", () => {
    const { container: container1 } = render(
      <svg>
        <Piece color="#E74C3C" cx={50} cy={50} r={15} />
      </svg>
    );
    const { container: container2 } = render(
      <svg>
        <Piece color="#3498DB" cx={100} cy={100} r={15} />
      </svg>
    );
    
    const circle1 = container1.querySelector("circle");
    const circle2 = container2.querySelector("circle");
    
    expect(circle1?.getAttribute("fill")).toBe("#E74C3C");
    expect(circle2?.getAttribute("fill")).toBe("#3498DB");
  });
});

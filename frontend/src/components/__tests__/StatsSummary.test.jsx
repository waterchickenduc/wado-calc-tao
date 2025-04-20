// src/components/__tests__/StatsSummary.test.jsx
import React from "react"; // ← 🔧 This line was missing!
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsSummary from "../StatsSummary";

describe("StatsSummary", () => {
  it("does not render aura section if no runes have auras", () => {
    render(
      <StatsSummary
        totalStats={{}}
        runeStats={{ P: 10 }}
        auraStats={{}}
        classStats={{}}
        runes={[]}
      />
    );

    expect(screen.queryByText("Total by Auras")).not.toBeInTheDocument();
  });

  it("renders Total, Runes, Auras, Classes correctly with multiple aura types", () => {
    const runes = [
      {
        name: "RuneA",
        aura: "Thorns",
        auraChance: 6,
        auraStats: [
          { Stat: "P. Atk", Value: 35 },
          { Stat: "M. Atk", Value: 35 },
        ],
        stats: [{ Stat: "P. Atk", Value: 10 }],
      },
      {
        name: "RuneB",
        aura: "Dream",
        auraChance: 2,
        auraStats: [{ Stat: "HP Recovery", Value: 15 }],
        stats: [{ Stat: "M. Atk", Value: 5 }],
      },
    ];

    const classStats = {
      "Ele. Def": 5,
      "P. Atk": 10,
    };

    render(
      <StatsSummary
        totalStats={{
          "P. Atk": 55,
          "M. Atk": 40,
          "HP Recovery": 15,
          "Ele. Def": 5,
        }}
        runeStats={{ "P. Atk": 10, "M. Atk": 5 }}
        auraStats={{ "P. Atk": 35, "M. Atk": 35, "HP Recovery": 15 }}
        classStats={classStats}
        runes={runes}
      />
    );

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Total by Runes")).toBeInTheDocument();
    expect(screen.getByText("Total by Auras")).toBeInTheDocument();
    expect(screen.getByText("Total by Classes")).toBeInTheDocument();

    // Auras
    expect(screen.getByText("Thorns")).toBeInTheDocument();
    expect(screen.getByText("Trigger Chance: 6.00%")).toBeInTheDocument();
    expect(screen.getByText("Dream")).toBeInTheDocument();
    expect(screen.getByText("Trigger Chance: 2.00%")).toBeInTheDocument();
  });

  it("matches snapshot of full render", () => {
    const runes = [
      {
        name: "RuneX",
        aura: "Sanctuary",
        auraChance: 5,
        auraStats: [
          { Stat: "P. Atk", Value: 10 },
          { Stat: "M. Def", Value: 10 },
        ],
        stats: [{ Stat: "Cr. Rate", Value: 3 }],
      },
    ];

    const classStats = {
      "Increase INT": 0.25,
    };

    const { container } = render(
      <StatsSummary
        totalStats={{ "P. Atk": 10, "Cr. Rate": 3, "M. Def": 10, "Increase INT": 0.25 }}
        runeStats={{ "Cr. Rate": 3 }}
        auraStats={{ "P. Atk": 10, "M. Def": 10 }}
        classStats={classStats}
        runes={runes}
      />
    );

    expect(container).toMatchSnapshot();
  });
});

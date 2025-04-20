import React from "react";
import { render, screen } from "@testing-library/react";
import StatsSummary from "../StatsSummary";
import runeAuras from "../../data/runeAuras.json";

const mockRunes = [
  {
    name: "Petra",
    aura: "Thorns (3%)",
    auraChance: 3,
    stats: [
      { Stat: "Ele. Def", Value: 7 },
      { Stat: "Increase INT", Value: 0.25 },
    ]
  },
  {
    name: "Petra",
    aura: "Thorns (3%)",
    auraChance: 3,
    stats: [
      { Stat: "Ele. Def", Value: 7 },
      { Stat: "Increase INT", Value: 0.25 },
    ]
  },
  {
    name: "Draumr",
    aura: "Dream (2%)",
    auraChance: 2,
    stats: [{ Stat: "Cr. Rate", Value: 3 }]
  },
  {
    name: "Darkstone",
    aura: "Corrupt (5%)",
    auraChance: 5,
    stats: []
  }
];

const mockClassStats = {
  "Ele. Def": 5,
  "P. Atk": 10
};

describe("StatsSummary", () => {
  test("does not render aura section if no runes have aura", () => {
    render(<StatsSummary runeStats={{}} classStats={{}} runes={[]} />);
    expect(screen.queryByText("Total by Auras")).not.toBeInTheDocument();
  });

  test("renders Total, Runes, Auras, Classes correctly with multiple aura types", () => {
    render(
      <StatsSummary runeStats={{}} classStats={mockClassStats} runes={mockRunes} />
    );

    // ✅ Section checks
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Total by Runes")).toBeInTheDocument();
    expect(screen.getByText("Total by Auras")).toBeInTheDocument();
    expect(screen.getByText("Total by Classes")).toBeInTheDocument();

    // ✅ Aura blocks
    expect(screen.getByText("Thorns")).toBeInTheDocument();
    expect(screen.getByText("Dream")).toBeInTheDocument();
    expect(screen.getByText("Corrupt")).toBeInTheDocument();

    // 🧪 Trigger chance & stats
    expect(screen.getByText(/Trigger Chance:\s*6.00/)).toBeInTheDocument();
    expect(screen.getByText(/Trigger Chance:\s*2.00/)).toBeInTheDocument();
    expect(screen.getByText(/Trigger Chance:\s*5.00/)).toBeInTheDocument();

    // 📌 Safe numeric value assertions
    expect(screen.getAllByText("15.00%").length).toBeGreaterThanOrEqual(1); // HP Recovery
    expect(screen.getByText("70.00%")).toBeInTheDocument(); // M. Atk or P. Atk from Thorns
    expect(screen.getByText("10.00%")).toBeInTheDocument(); // Class Ele. Def or Corrupt Ele. Def
  });

  test("snapshot of full render", () => {
    const { container } = render(
      <StatsSummary runeStats={{}} classStats={mockClassStats} runes={mockRunes} />
    );
    expect(container).toMatchSnapshot();
  });
});

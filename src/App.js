import clsx from "clsx";
import { useEffect, useState } from "react";
import { combinationsLength, combinationsOf, systems } from "./domain";

function App() {
  const [showCombinations, setShowCombinations] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState([2, 3]);
  const [bets, setBets] = useState({
    totalStake: 100,
    odds: new Array(selectedSystem[1]).fill(null).map((_, index) => ({
      index: index + 1,
      coefficient: 2,
      variant: "correct",
    })),
  });

  useEffect(() => {
    if (selectedSystem[1] === bets.length) {
      return;
    }
    setBets((old) => ({
      ...old,
      odds: new Array(selectedSystem[1]).fill(null).map((_, index) => ({
        index: index + 1,
        coefficient: 2,
        variant: "correct",
      })),
    }));
  }, [selectedSystem, setBets]);

  function changeCoefficient(index, coefficient) {
    setBets((old) => ({
      ...old,
      odds: old.odds.map((bet) => {
        if (bet.index === index) {
          return {
            ...bet,
            coefficient: coefficient,
          };
        }
        return bet;
      }),
    }));
  }

  function changeVariant(index, variant) {
    setBets((old) => ({
      ...old,
      odds: old.odds.map((bet) => {
        if (bet.index === index) {
          return {
            ...bet,
            variant: variant,
          };
        }
        return bet;
      }),
    }));
  }

  function changeTotalStake(stake) {
    setBets((old) => ({
      ...old,
      totalStake: Number(stake),
    }));
  }

  return (
    <div className="w-screen h-screen flex items-center flex-col gap-[16px]">
      <header className="text-[20px] font-bold">System Bets Calculator</header>
      <div className="flex items-start gap-[16px]">
        <div className="bg-gray-100 rounded-md p-[8px] w-[300px] flex-col flex gap-[20px]">
          <div className="flex gap-[100px]">
            <span>System</span>
            <select
              onChange={(e) => {
                showCombinations && setShowCombinations(false);
                const values = e.currentTarget.value.split(",");
                const k = Number(values[0]);
                const n = Number(values[1]);
                setSelectedSystem([k, n]);
              }}
              className="outline-none rounded-md text-[16px]"
            >
              {systems.map((o, index) => (
                <option key={index} value={o}>
                  {o[0]} from {o[1]}
                </option>
              ))}
            </select>
          </div>

          <p>
            A system {selectedSystem[0]} from {selectedSystem[1]} contains{" "}
            {combinationsLength(selectedSystem)} combinations
          </p>
        </div>

        <div className="bg-gray-100 rounded-md p-[8px] gap-[8px] w-[600px] flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <span>Total Stake</span>
            <input
              value={bets.totalStake}
              onChange={(e) => {
                showCombinations && setShowCombinations(false);
                changeTotalStake(e.currentTarget.value);
              }}
              className="w-[100px] bg-gray-200 px-[8px] rounded-[24px] outline-none"
            />
            <span>EUR</span>
          </div>

          <div className="h-[1px] w-full bg-gray-400" />

          <div className="flex flex-col w-full">
            <div className="flex gap-[10px] w-full justify-end">
              <span className="font-bold text-green-400">Correct</span>
              <span className="font-bold text-red-400">Incorrect</span>
              <span className="font-bold text-yellow-400">Void</span>
            </div>
            <div className="w-full flex flex-col gap-[4px]">
              {bets.odds.map((bet, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>Odds {bet.index}</span>
                  <input
                    value={bet.coefficient}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      if (!isNaN(value) || value === "") {
                        changeCoefficient(bet.index, value);
                      }
                    }}
                    className="w-[100px] bg-gray-200 px-[8px] rounded-[24px] outline-none"
                  />
                  <div className="flex gap-[50px] pl-[20px] pr-[10px]">
                    {["correct", "incorrect", "void"].map((variant) => (
                      <button
                        key={variant}
                        className="h-[10px] w-[10px] rounded-full border border-black p-[1px]"
                        onClick={() => changeVariant(bet.index, variant)}
                      >
                        {bet.variant === variant && (
                          <div className="h-full w-full bg-green-600 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] w-full bg-gray-400" />

          <button
            className="p-[6px] bg-gray-500 text-white rounded-md"
            onClick={() => setShowCombinations(true)}
          >
            Compute
          </button>
        </div>
      </div>

      {showCombinations && (
        <div className="flex flex-col">
          <div className="border border-black rounded-md">
            <table className="w-[900px]">
              <thead className="border-b border-black">
                <tr>
                  <th className="min-w-[70px] max-w-[70px] border-r border-black">
                    Index
                  </th>
                  <th className="w-full border-x border-black">Combinations</th>
                  <th className="min-w-[150px] max-w-[150px] border-r border-black">
                    Odds
                  </th>
                  <th className="min-w-[100px] max-w-[100px]">Winnings</th>
                </tr>
              </thead>
              <tbody>
                {combinationsOf(
                  bets.odds.map((odd) => odd.coefficient),
                  selectedSystem[0],
                ).map((combination, i) => {
                  const bet = bets.odds.find((b) => b.index === i + 1);
                  const stake =
                    bets.totalStake / combinationsLength(selectedSystem);

                  return (
                    <Row
                      key={i}
                      bet={bet}
                      combination={combination}
                      stake={stake}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-1">
            <span>Winnings:</span>
            <span>Stake: {bets.totalStake}</span>
            <span>
              Stake per combination:{" "}
              {(bets.totalStake / combinationsLength(selectedSystem)).toFixed(
                2,
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ index, stake, combination, bet }) {
  const combinedOdds = combination.reduce((acc, coeff) => {
    if (bet) {
      switch (bet.variant) {
        case "correct":
          return acc * coeff;
        case "incorrect":
          return acc * 0;
        case "void":
          return acc * 1;
      }
    }
    return acc;
  }, 1);
  const winnings = stake * combinedOdds;

  return (
    <tr className={clsx(index !== 1 && "border-t border-black")}>
      <td className="border-r border-black text-center">{index}</td>
      <td className="flex">
        {combination.map((c, index) => (
          <div
            key={index}
            className={clsx(
              index !== 0 && "border-l border-black",
              "w-full text-center",
            )}
          >
            {Number(c).toFixed(2)}
          </div>
        ))}
      </td>
      <td className="text-center border-x border-black">
        {combinedOdds.toFixed(2)}
      </td>
      <td className="text-center">{winnings.toFixed(2)}</td>
    </tr>
  );
}

export default App;

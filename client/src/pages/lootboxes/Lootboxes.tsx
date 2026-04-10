import { lootboxes, rarities, type LootboxKey } from "@shared/schemas/game/lootboxes";
import { useState } from "react";
import "./Lootboxes.css";
import { postAPI } from "../../API";
import { useUserData } from "../../userData";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default function Lootboxes() {
  const { userData } = useUserData();
  const [opening, setOpening] = useState<{ boxKey: string; title: string | null; phase: "shaking" | "opening" | "reveal" } | null>(null);

  const boxes = Object.entries(lootboxes);
  const tokens = userData?.user.tokens ?? 0;

  async function handleClick(boxKey: string) {
    if (opening) return;

    setOpening({ boxKey, title: null, phase: "shaking" });
    await new Promise(r => setTimeout(r, 700));

    setOpening(prev => prev ? { ...prev, phase: "opening" } : null);
    const res = await postAPI("/game/buyLootbox", { box: boxKey });
    const data = res?.ok ? await res.json() : null;
    const title = data?.title ?? "Unknown";
    
    await new Promise(r => setTimeout(r, 600));
    setOpening({ boxKey, title, phase: "reveal" });
  }

  function handleClose() {
    setOpening(null);
  }

  return (
    <div id="lootboxes-page">
      <h1>Lootboxes</h1>
      <p className="token-count">🪙 {Math.round(tokens*100)/100} tokens</p>
      <div className="lootbox-grid">
        {boxes.map(([key, box], i) => {
          const rgb = hexToRgb(box.color);
          const isLast = i === boxes.length - 1;
          const canAfford = tokens >= box.price;
          return (
            <div
              key={box.name}
              className={`lootbox${isLast ? " glowing" : ""}${!canAfford ? " disabled" : ""}`}
              style={{ "--rgb": rgb } as React.CSSProperties}
              onClick={() => canAfford && handleClick(key)}
              title={canAfford ? "" : "Not enough money"}
            >
              <div className="lootbox-lid">
                <div className="plank" />
                <div className="plank" />
                <div className="latch" />
              </div>
              <div className="lootbox-body">
                <div className="plank" />
                <div className="plank" />
                <div className="plank" />
                <div className="nail tl" /><div className="nail tr" />
                <div className="nail bl" /><div className="nail br" />
                <span className="lootbox-name">{box.name}</span>
              </div>
              <h4 className="text-center w-100 mt-2">${box.price}</h4>
            </div>
          );
        })}
      </div>

      {opening && (() => {
        const box = lootboxes[opening.boxKey as LootboxKey];
        const rgb = hexToRgb(box.color);
        const rarity = Object.values(rarities).find(r => r.names.some(n => n === opening.title));
        return (
          <div className="lb-overlay" onClick={opening.phase === "reveal" ? handleClose : undefined}>
            <div
              className={`lb-modal lb-modal--${opening.phase}`}
              style={{ "--rgb": rgb } as React.CSSProperties}
            >
              <div className={`lb-crate-wrap lb-crate-wrap--${opening.phase}`}>
                <div className={`lb-lid lb-lid--${opening.phase}`}>
                  <div className="plank" /><div className="plank" />
                  <div className="latch" />
                </div>
                <div className="lb-body">
                  <div className="plank" /><div className="plank" /><div className="plank" />
                  <div className="nail tl" /><div className="nail tr" />
                  <div className="nail bl" /><div className="nail br" />
                  {opening.phase === "opening" && <div className="lb-rays" />}
                </div>
              </div>

              {opening.phase === "reveal" && (
                <div className="lb-reveal">
                  <p className="lb-reveal-label">You got</p>
                  <h2 className="lb-reveal-title">{opening.title}</h2>
                  <h3 className="lb-reveal-label" style={{ color: rarity?.color, fontSize: "15px" }}>( {rarity?.displayName} )</h3>
                  <p className="lb-reveal-hint">Click anywhere to close</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
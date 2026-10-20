"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { MIN_RENT, MAX_RENT } from "@/lib/filters";
import { moveInCosts, agencyFeeLabel } from "@/lib/costs";
import { money } from "@/lib/format";

function Amount({ value }) {
  const ref = useRef(null);
  const prev = useRef(value);
  // React renders the first value only; later updates are written by the tween below.
  const initial = useRef(value).current;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.textContent = money(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = money(v);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>{money(initial)}</span>;
}

export default function CostCalculator() {
  const [rent, setRent] = useState(900);
  const [months, setMonths] = useState(1);
  const c = moveInCosts(rent, months);
  const pct = ((rent - MIN_RENT) / (MAX_RENT - MIN_RENT)) * 100;

  return (
    <div className="calc">
      <h3 className="calc__title">Move-in cost calculator</h3>

      <div className="calc__field">
        <label htmlFor="calc-rent">
          Monthly rent <strong>{money(rent)}</strong>
        </label>
        <input
          id="calc-rent"
          className="range"
          type="range"
          min={MIN_RENT}
          max={MAX_RENT}
          step={50}
          value={rent}
          onChange={(e) => setRent(Number(e.target.value))}
          style={{ "--fill": `${pct}%` }}
        />
        <div className="range__ends" aria-hidden="true">
          <span>{money(MIN_RENT)}</span>
          <span>{money(MAX_RENT)}</span>
        </div>
      </div>

      <fieldset className="calc__field calc__seg">
        <legend>Security deposit</legend>
        {[1, 2].map((m) => (
          <label key={m} className={months === m ? "is-on" : ""}>
            <input type="radio" name="deposit" value={m} checked={months === m} onChange={() => setMonths(m)} />
            {m} month{m > 1 ? "s" : ""}
          </label>
        ))}
      </fieldset>

      <dl className="calc__lines">
        <div><dt>First month’s rent</dt><dd><Amount value={c.firstMonth} /></dd></div>
        <div><dt>Refundable deposit</dt><dd><Amount value={c.deposit} /></dd></div>
        <div><dt>Agency fee ({agencyFeeLabel}, once)</dt><dd><Amount value={c.agencyFee} /></dd></div>
      </dl>

      <p className="calc__total" aria-live="polite">
        <span>Due at signing</span>
        <strong><Amount value={c.total} /></strong>
      </p>
      <p className="calc__note">Illustrative figures. Final terms are set out in your lease.</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { TickerItem } from "../data/ticker";
import styles from "./Ticker.module.css";

const ROTATE_MS = 3200; // 디자인 §6.2: 3.2초마다 전환
const LANE_OFFSET_MS = 1600; // 두 레인이 동시에 전환되지 않도록 절반 만큼 어긋나게

type LaneState = {
  /** 레이어 a의 인덱스 */
  a: number;
  /** 레이어 b의 인덱스 */
  b: number;
  /** 현재 화면에 보이는 레이어 */
  active: "a" | "b";
};

type LaneProps = {
  items: TickerItem[];
  /** 처음 보일 항목 인덱스. 두 레인이 다른 헤드라인으로 시작하도록. */
  startIndex?: number;
  /** 첫 회전 시작 지연. 두 레인의 fade 시점을 어긋나게 함. */
  delayMs?: number;
};

function TickerLane({ items, startIndex = 0, delayMs = 0 }: LaneProps) {
  const [layers, setLayers] = useState<LaneState>(() => ({
    a: startIndex,
    b: (startIndex + 1) % items.length,
    active: "a",
  }));
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* prefers-reduced-motion 감지 (변경에도 반응) */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* 회전 타이머 */
  useEffect(() => {
    if (paused || reduced) return;

    const tick = () => {
      setLayers((prev) => {
        const currentIndex = prev[prev.active];
        const nextIndex = (currentIndex + 1) % items.length;
        return prev.active === "a"
          ? { a: prev.a, b: nextIndex, active: "b" }
          : { a: nextIndex, b: prev.b, active: "a" };
      });
    };

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      intervalId = setInterval(tick, ROTATE_MS);
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [paused, reduced, items.length, delayMs]);

  const itemA = items[layers.a];
  const itemB = items[layers.b];

  return (
    <div
      className={styles.lane}
      role="region"
      aria-label="실시간 헤드라인"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={`${styles.layer} ${layers.active === "a" ? styles.show : ""}`}
        aria-hidden={layers.active !== "a"}
      >
        <span className={styles.press}>{itemA.press}</span>
        <span className={styles.title}>{itemA.title}</span>
      </div>
      <div
        className={`${styles.layer} ${layers.active === "b" ? styles.show : ""}`}
        aria-hidden={layers.active !== "b"}
      >
        <span className={styles.press}>{itemB.press}</span>
        <span className={styles.title}>{itemB.title}</span>
      </div>
    </div>
  );
}

type TickerProps = {
  items: TickerItem[];
};

export function Ticker({ items }: TickerProps) {
  /* 두 레인이 같은 항목으로 시작하지 않도록 lane 2의 시작 인덱스를 절반 뒤로 */
  const lane2Start = Math.floor(items.length / 2);

  return (
    <div className={styles.ticker}>
      <TickerLane items={items} startIndex={0} delayMs={0} />
      <TickerLane
        items={items}
        startIndex={lane2Start}
        delayMs={LANE_OFFSET_MS}
      />
    </div>
  );
}

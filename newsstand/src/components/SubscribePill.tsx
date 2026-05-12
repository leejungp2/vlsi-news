import type { MouseEvent } from "react";
import styles from "./SubscribePill.module.css";

export type PillMode = "subscribe" | "unsubscribe";

type Props = {
  mode: PillMode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

/* 10×10 plus/minus 아이콘 — stroke --sub, width 1.4 */
function PlusIcon() {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M5 1.5v7" />
      <path d="M1.5 5h7" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={styles.icon}
    >
      <path d="M1.5 5h7" />
    </svg>
  );
}

export function SubscribePill({ mode, onClick }: Props) {
  const isSub = mode === "subscribe";
  return (
    <button
      type="button"
      className={styles.pill}
      aria-label={isSub ? "구독하기" : "해지하기"}
      onClick={onClick}
    >
      {isSub ? <PlusIcon /> : <MinusIcon />}
      <span className={styles.label}>{isSub ? "구독하기" : "해지하기"}</span>
    </button>
  );
}

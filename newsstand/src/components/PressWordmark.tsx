import type { CSSProperties, ReactNode } from "react";
import type { Press } from "../data/press";
import styles from "./PressWordmark.module.css";

type Props = {
  press: Press;
};

/* ============================================================
 * 글자별 강조 처리:
 *   - 정규 글자
 *   - accent (색 또는 chip 배경)
 *   - accentUnder (밑줄만 accent 색)
 * 연속된 같은 종류는 하나의 <span>으로 병합한다.
 * ============================================================ */

type RunType = "regular" | "accent" | "accentUnder";

function buildRuns(
  name: string,
  accentChars?: number[],
  accentUnder?: number[],
): { type: RunType; text: string }[] {
  const accentSet = new Set(accentChars ?? []);
  const underSet = new Set(accentUnder ?? []);

  const classify = (i: number): RunType => {
    if (accentSet.has(i)) return "accent";
    if (underSet.has(i)) return "accentUnder";
    return "regular";
  };

  const runs: { type: RunType; text: string }[] = [];
  for (let i = 0; i < name.length; i++) {
    const type = classify(i);
    const last = runs[runs.length - 1];
    if (last && last.type === type) {
      last.text += name[i];
    } else {
      runs.push({ type, text: name[i] });
    }
  }
  return runs;
}

/* ============================================================
 * 빨간 국기 글리프 (아시아경제 스타일)
 * ============================================================ */
function FlagGlyph() {
  return (
    <svg
      className={styles.flag}
      viewBox="0 0 6 10"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="0.7" height="10" fill="currentColor" />
      <path d="M0.7 0 L6 1 L4.5 2.5 L6 4 L0.7 4 Z" fill="#E63946" />
    </svg>
  );
}

export function PressWordmark({ press }: Props) {
  const {
    name,
    color,
    bg,
    weight = 700,
    family = "sans",
    italic,
    underline,
    tracking,
    accent,
    accentChars,
    accentUnder,
    accentBg,
    flag,
    latin,
    small,
  } = press;

  /* === 컨테이너 클래스 조립 === */
  const containerClasses = [
    styles.wordmark,
    family === "serif" && styles.serif,
    italic && styles.italic,
    underline && styles.underline,
    small && styles.small,
    bg && styles.chip,
  ]
    .filter(Boolean)
    .join(" ");

  /* === 컨테이너 inline style (토큰화 안 되는 동적 값) === */
  const containerStyle: CSSProperties = {
    color: color ?? "var(--ink)",
    fontWeight: weight,
    ...(tracking !== undefined && { letterSpacing: tracking }),
    ...(latin && tracking === undefined && { letterSpacing: "var(--tracking-latin)" }),
    ...(bg && { background: bg }),
  };

  /* === 글자별 렌더링 === */
  const runs = buildRuns(name, accentChars, accentUnder);
  const children: ReactNode[] = runs.map((run, idx) => {
    if (run.type === "regular") return run.text;

    if (run.type === "accent") {
      if (accentBg) {
        return (
          <span
            key={idx}
            className={styles.accentChip}
            style={{ background: accent }}
          >
            {run.text}
          </span>
        );
      }
      return (
        <span key={idx} className={styles.accent} style={{ color: accent }}>
          {run.text}
        </span>
      );
    }

    /* accentUnder */
    return (
      <span
        key={idx}
        className={styles.accentUnder}
        style={{ textDecorationColor: accent }}
      >
        {run.text}
      </span>
    );
  });

  return (
    <span className={containerClasses} style={containerStyle}>
      {children}
      {flag && <FlagGlyph />}
    </span>
  );
}

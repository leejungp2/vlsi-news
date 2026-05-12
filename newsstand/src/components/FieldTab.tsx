import { CATEGORIES, type CategoryKey } from "../data/categories";
import styles from "./FieldTab.module.css";

type Props = {
  activeKey: CategoryKey;
  /** 활성 탭 안 카운터의 현재 인덱스(1-base) */
  currentInTab: number;
  /** 활성 탭 안 카운터의 총 개수 */
  totalInTab: number;
  /** 0..100, 활성 탭의 진행 바 너비 % */
  progress: number;
  onTabClick: (key: CategoryKey) => void;
};

export function FieldTab({
  activeKey,
  currentInTab,
  totalInTab,
  progress,
  onTabClick,
}: Props) {
  return (
    <div className={styles.fieldtab} role="tablist" aria-label="카테고리">
      {CATEGORIES.map((cat, idx) => {
        const isActive = cat.key === activeKey;
        const isLast = idx === CATEGORIES.length - 1;
        return (
          <button
            type="button"
            key={cat.key}
            role="tab"
            aria-selected={isActive}
            className={[
              styles.tab,
              isActive ? styles.active : "",
              !isLast ? styles.withDivider : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onTabClick(cat.key)}
          >
            {/* 활성 탭의 진행 overlay — role=progressbar로 SR에 진행률 노출 */}
            {isActive && (
              <span
                className={styles.progress}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="현재 카테고리 진행도"
              />
            )}
            <span className={styles.label}>{cat.label}</span>
            {isActive && (
              <span
                className={styles.counter}
                aria-label={`${currentInTab} / ${totalInTab}`}
              >
                {/* 디자인 §6.9: 현재값 "1"은 full opacity, "/ 81"은 opacity 0.7 */}
                <span className={styles.counterPrimary}>{currentInTab}</span>
                <span className={styles.counterSep}>{" / "}</span>
                <span className={styles.counterTotal}>{totalInTab}</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

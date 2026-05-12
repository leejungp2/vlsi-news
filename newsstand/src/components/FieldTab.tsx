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
      {CATEGORIES.map((cat) => {
        const isActive = cat.key === activeKey;
        return (
          <button
            type="button"
            key={cat.key}
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => onTabClick(cat.key)}
          >
            {/* 활성 탭의 진행 overlay.
             * SR에 진행률을 노출하려고 progressbar role + aria-valuenow 사용. */}
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
                {currentInTab} / {totalInTab}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

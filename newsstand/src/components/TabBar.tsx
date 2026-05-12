import styles from "./TabBar.module.css";

export type TabKey = "all" | "subscribed";
export type ViewKey = "grid" | "list";

type Props = {
  tab: TabKey;
  view: ViewKey;
  subCount: number;
  onTabChange: (next: TabKey) => void;
  onViewChange: (next: ViewKey) => void;
};

/* 24×24 stroke 아이콘 — 디자인 §6.4 우측 토글 */
function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--ink)" : "var(--mute)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--ink)" : "var(--mute)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h14" />
    </svg>
  );
}

export function TabBar({
  tab,
  view,
  subCount,
  onTabChange,
  onViewChange,
}: Props) {
  return (
    <div className={styles.tabbar}>
      <div className={styles.tabs} role="tablist" aria-label="언론사 보기 기준">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "all"}
          className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`}
          onClick={() => onTabChange("all")}
        >
          전체 언론사
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "subscribed"}
          className={`${styles.tab} ${
            tab === "subscribed" ? styles.tabActive : ""
          }`}
          onClick={() => onTabChange("subscribed")}
        >
          <span>내가 구독한 언론사</span>
          <span
            className={styles.badge}
            aria-label={`구독 ${subCount}개`}
          >
            {subCount}
          </span>
        </button>
      </div>

      <div
        className={styles.viewToggle}
        role="group"
        aria-label="보기 방식"
      >
        <button
          type="button"
          className={styles.viewBtn}
          aria-label="리스트 보기"
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
        >
          <ListIcon active={view === "list"} />
        </button>
        <button
          type="button"
          className={styles.viewBtn}
          aria-label="그리드 보기"
          aria-pressed={view === "grid"}
          onClick={() => onViewChange("grid")}
        >
          <GridIcon active={view === "grid"} />
        </button>
      </div>
    </div>
  );
}

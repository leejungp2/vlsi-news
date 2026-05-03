import styles from "./Header.module.css";

type HeaderProps = {
  /** 표시할 날짜. 미지정 시 현재 시각. */
  date?: Date;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** "2026. 01. 14. 수요일" 형식. */
function formatHeaderDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekday = WEEKDAYS[d.getDay()];
  return `${y}. ${m}. ${day}. ${weekday}요일`;
}

function NewspaperIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h13a2 2 0 0 1 2 2v11a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18V5Z" />
      <path d="M19 8h1.5A1.5 1.5 0 0 1 22 9.5V18a1.5 1.5 0 0 1-1.5 1.5H19" />
      <path d="M7 9h9" />
      <path d="M7 12h9" />
      <path d="M7 15h6" />
    </svg>
  );
}

export function Header({ date = new Date() }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <NewspaperIcon />
        <h1 className={styles.title}>뉴스스탠드</h1>
      </div>
      <time className={styles.date} dateTime={date.toISOString().slice(0, 10)}>
        {formatHeaderDate(date)}
      </time>
    </header>
  );
}

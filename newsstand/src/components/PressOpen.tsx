import type { Press } from "../data/press";
import type { CategoryKey } from "../data/categories";
import { PressWordmark } from "./PressWordmark";
import { SubscribePill } from "./SubscribePill";
import { FieldTab } from "./FieldTab";
import { getArticlesFor } from "../data/articles";
import styles from "./PressOpen.module.css";

type Props = {
  press: Press;
  subscribed: boolean;
  onSubscribeToggle: () => void;

  /* FieldTab 상태 — 모두 부모(Newsstand)에서 흘러옴 */
  activeCategory: CategoryKey;
  currentInTab: number;
  totalInTab: number;
  progress: number;
  onCategoryChange: (next: CategoryKey) => void;
};

/** "yyyy.MM.dd. HH:mm 편집" — 디자인 §6.13 우상단 캡션 */
function formatEditedAt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day}. ${hh}:${mm} 편집`;
}

export function PressOpen({
  press,
  subscribed,
  onSubscribeToggle,
  activeCategory,
  currentInTab,
  totalInTab,
  progress,
  onCategoryChange,
}: Props) {
  const article = getArticlesFor(press.id, press.name);
  const editedAt = formatEditedAt(new Date(2026, 0, 14, 9, 17)); // 디자인 프레임 기준

  return (
    <div className={styles.open}>
      <FieldTab
        activeKey={activeCategory}
        currentInTab={currentInTab}
        totalInTab={totalInTab}
        progress={progress}
        onTabClick={onCategoryChange}
      />

      {/* aria-live="polite": auto-advance로 press가 바뀔 때 SR이 새 헤드라인을 읽음.
       * aria-atomic="true"로 부분 변경이 아니라 전체 영역을 한 번에 다시 읽게 함. */}
      <div
        className={styles.body}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* 헤드 행: 워드마크 + 편집 시간 + 구독/해지 pill */}
        <div className={styles.head}>
          <div className={styles.brand}>
            <span className={styles.wordmarkScale}>
              <PressWordmark press={press} />
            </span>
            <time className={styles.editedAt}>{editedAt}</time>
          </div>
          <SubscribePill
            mode={subscribed ? "unsubscribe" : "subscribe"}
            onClick={onSubscribeToggle}
          />
        </div>

        {/* 본문: 좌 340 이미지+헤드라인 / 우 기사 6 + footnote */}
        <div className={styles.content}>
          <div className={styles.left}>
            <div
              className={styles.image}
              style={{ background: article.imageGradient }}
              role="img"
              aria-label="기사 대표 이미지"
            />
            <h2 className={styles.headline}>{article.headline}</h2>
          </div>

          <div className={styles.right}>
            <ul className={styles.items}>
              {article.items.map((title, i) => (
                <li key={i} className={styles.item}>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.footnote}>{article.footnote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

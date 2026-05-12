import type { Press } from "../data/press";
import { GridCell } from "./GridCell";
import { Chevron } from "./Chevron";
import styles from "./PressGrid.module.css";

const COLS = 6;
const ROWS = 4;
const PER_PAGE = COLS * ROWS; // 24

type Props = {
  presses: Press[];
  page: number;
  pageCount: number;
  /** 현재 구독 중인 언론사 id 집합 — 각 셀의 Pill 라벨이 이 값으로 토글 */
  subscribed: Set<string>;
  onPageChange: (next: number) => void;
  onPillClick: (pressId: string) => void;
  onOpen: (pressId: string) => void;
};

export function PressGrid({
  presses,
  page,
  pageCount,
  subscribed,
  onPageChange,
  onPillClick,
  onOpen,
}: Props) {
  /* 현재 페이지에 보일 24개 슬라이스 */
  const start = page * PER_PAGE;
  const slice = presses.slice(start, start + PER_PAGE);

  /* 부족한 자리는 빈 흰색 셀로 채워 6×4 모양 유지 */
  const emptyCount = PER_PAGE - slice.length;

  /* chevron은 페이지가 1개뿐이면 양쪽 모두 disabled (display:none이 아니라 opacity:0) */
  const atFirst = page <= 0;
  const atLast = page >= pageCount - 1;

  return (
    <div className={styles.wrap}>
      <Chevron
        direction="left"
        disabled={atFirst}
        onClick={() => onPageChange(page - 1)}
      />

      {/* role="grid"는 ARIA에서 2D 키보드 내비게이션(arrow keys + roving tabindex)을 함의함.
       * 우리는 그걸 구현하지 않으므로 region으로 두는 게 정확. */}
      <div className={styles.grid} role="region" aria-label="언론사 목록">
        {slice.map((press) => (
          <GridCell
            key={press.id}
            press={press}
            isSubscribed={subscribed.has(press.id)}
            onPillClick={onPillClick}
            onOpen={onOpen}
          />
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.empty} aria-hidden="true" />
        ))}
      </div>

      <Chevron
        direction="right"
        disabled={atLast}
        onClick={() => onPageChange(page + 1)}
      />
    </div>
  );
}

import type { MouseEvent } from "react";
import type { Press } from "../data/press";
import { PressWordmark } from "./PressWordmark";
import { SubscribePill, type PillMode } from "./SubscribePill";
import styles from "./GridCell.module.css";

type Props = {
  press: Press;
  /** 디자인 §7 cell hover states: "전체 언론사" 탭 = subscribe, "구독한 언론사" 탭 = unsubscribe */
  mode: PillMode;
  onPillClick: (pressId: string) => void;
  onOpen: (pressId: string) => void;
};

export function GridCell({ press, mode, onPillClick, onOpen }: Props) {
  /* Pill 클릭은 셀 onClick까지 전파되면 안 됨 (리스트 뷰 진입 막기) */
  const handlePillClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onPillClick(press.id);
  };

  return (
    <div
      className={styles.cell}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(press.id)}
      onKeyDown={(e) => {
        /* 자식(Pill 버튼)에서 올라온 키는 무시 — 셀 본체 키 입력만 처리.
         * 안 그러면 Pill에 포커스된 채 Enter 시 구독 토글 + 리스트 진입 둘 다 발동. */
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(press.id);
        }
      }}
      aria-label={`${press.name} 기사 보기`}
    >
      <div className={styles.wordmark}>
        <PressWordmark press={press} />
      </div>
      <div className={styles.pill}>
        <SubscribePill mode={mode} onClick={handlePillClick} />
      </div>
    </div>
  );
}

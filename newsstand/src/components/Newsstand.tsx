import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./Header";
import { Ticker } from "./Ticker";
import { TabBar, type TabKey, type ViewKey } from "./TabBar";
import { PressGrid } from "./PressGrid";
import { PressOpen } from "./PressOpen";
import { TICKER } from "../data/ticker";
import {
  PRESS_LIST,
  PRESS_BY_ID,
  PRESSES_BY_CATEGORY,
  PAGE_SIZE,
} from "../data/press";
import { CATEGORIES, type CategoryKey } from "../data/categories";
import styles from "./Newsstand.module.css";

const PROGRESS_TICK_MS = 100;
const PROGRESS_DURATION_MS = 6000;
const PROGRESS_STEP = (100 * PROGRESS_TICK_MS) / PROGRESS_DURATION_MS;

/**
 * 최상위 컨테이너 (체크리스트 #16).
 *
 * 모든 상태를 한 곳에 모은다:
 *  - tab/view/page/subscribed  ─ 그리드 영역
 *  - opened/fieldKey/progress  ─ 리스트 뷰 영역
 *
 * 캔버스는 1280×720 고정, 좌우 거터 175, 콘텐츠 930.
 * 1280px 미만 뷰포트에서는 CSS transform: scale로 비례 축소.
 */
export function Newsstand() {
  /** 디자인 프레임 기준 날짜로 시각 검증. 실서비스 전환 시 new Date()로. */
  const designDate = new Date(2026, 0, 14);

  /* === 그리드 상태 === */
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<ViewKey>("grid");
  const [page, setPage] = useState(0);
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

  /* === 리스트 뷰 상태 === */
  const [opened, setOpened] = useState<string | null>(null);
  const [fieldKey, setFieldKey] = useState<CategoryKey>("general");
  const [progress, setProgress] = useState(0);

  /* === 파생 값 === */
  const presses = useMemo(
    () =>
      tab === "all"
        ? PRESS_LIST
        : PRESS_LIST.filter((p) => subscribed.has(p.id)),
    [tab, subscribed],
  );
  const pageCount = Math.max(1, Math.ceil(presses.length / PAGE_SIZE));

  const fieldPresses = PRESSES_BY_CATEGORY[fieldKey];
  const currentIndex = opened
    ? Math.max(
        0,
        fieldPresses.findIndex((p) => p.id === opened),
      )
    : 0;
  const openedPress = opened ? PRESS_BY_ID[opened] : null;

  /* === advance: 같은 카테고리 다음 → 카테고리 끝이면 다음 카테고리 첫 항목 === */
  const advance = useCallback(() => {
    if (currentIndex + 1 < fieldPresses.length) {
      setOpened(fieldPresses[currentIndex + 1].id);
      setProgress(0);
      return;
    }
    const ci = CATEGORIES.findIndex((c) => c.key === fieldKey);
    const nextCategory = CATEGORIES[(ci + 1) % CATEGORIES.length];
    const list = PRESSES_BY_CATEGORY[nextCategory.key];
    setFieldKey(nextCategory.key);
    setOpened(list.length > 0 ? list[0].id : null);
    setProgress(0);
  }, [currentIndex, fieldPresses, fieldKey]);

  /* === 진행 타이머 — 리스트 뷰일 때만 === */
  useEffect(() => {
    if (view !== "list" || opened === null) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + PROGRESS_STEP;
        if (next >= 100) {
          advance();
          return 0;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);
    return () => clearInterval(id);
  }, [view, opened, advance]);

  /* === ESC → 그리드 복귀 === */
  useEffect(() => {
    if (view !== "list") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView("grid");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  /* === 핸들러 === */
  /** Pill 클릭 — 실제 구독 상태 기반 toggle.
   * Pill 라벨도 isSubscribed로 그려지므로 클릭 즉시 라벨과 동작이 동기화됨
   * (전체 탭이라도 이미 구독한 셀이면 "− 해지하기"로 보이고, 클릭 시 해지). */
  const handlePillClick = (id: string) => {
    const wasSubscribed = subscribed.has(id);
    setSubscribed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    /* 구독 탭에서 해지로 페이지가 비면 한 페이지 앞으로 */
    if (
      tab === "subscribed" &&
      wasSubscribed &&
      presses.length - 1 <= page * PAGE_SIZE
    ) {
      setPage((p) => Math.max(0, p - 1));
    }
  };

  const handleOpen = (id: string) => {
    const press = PRESS_BY_ID[id];
    if (!press) return;
    setFieldKey(press.category);
    setOpened(id);
    setProgress(0);
    setView("list");
  };

  const handleCategoryChange = (key: CategoryKey) => {
    const list = PRESSES_BY_CATEGORY[key];
    setFieldKey(key);
    setOpened(list.length > 0 ? list[0].id : null);
    setProgress(0);
  };

  const handleViewChange = (next: ViewKey) => {
    setView(next);
    if (next === "list") {
      if (opened === null) {
        const list = PRESSES_BY_CATEGORY[fieldKey];
        if (list.length > 0) setOpened(list[0].id);
      }
      setProgress(0);
    }
  };

  return (
    <div className={styles.scaler}>
      <div className={styles.canvas}>
        {/* 상단 콘텐츠 영역 — 930 wide, 좌 175 / 우 175 거터 */}
        <div className={styles.topStrip}>
          <Header date={designDate} />
          <Ticker items={TICKER} />
          <TabBar
            tab={tab}
            view={view}
            subCount={subscribed.size}
            onTabChange={(next) => {
              setTab(next);
              setPage(0);
            }}
            onViewChange={handleViewChange}
          />
        </div>

        {/* 그리드/리스트 뷰 영역.
         * 그리드는 1074 wide(chevron 포함, 캔버스 중앙), 리스트는 930. */}
        <div className={styles.pressArea}>
          {view === "grid" || openedPress === null ? (
            <PressGrid
              presses={presses}
              page={page}
              pageCount={pageCount}
              subscribed={subscribed}
              onPageChange={setPage}
              onPillClick={handlePillClick}
              onOpen={handleOpen}
            />
          ) : (
            <PressOpen
              press={openedPress}
              subscribed={subscribed.has(openedPress.id)}
              onSubscribeToggle={() => {
                setSubscribed((prev) => {
                  const next = new Set(prev);
                  if (next.has(openedPress.id)) next.delete(openedPress.id);
                  else next.add(openedPress.id);
                  return next;
                });
              }}
              activeCategory={fieldKey}
              currentInTab={currentIndex + 1}
              totalInTab={fieldPresses.length}
              progress={progress}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

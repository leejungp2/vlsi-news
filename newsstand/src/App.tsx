import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { PressGrid } from "./components/PressGrid";
import { PressOpen } from "./components/PressOpen";
import { TICKER } from "./data/ticker";
import {
  PRESS_LIST,
  PRESS_BY_ID,
  PRESSES_BY_CATEGORY,
  PAGE_SIZE,
} from "./data/press";
import { CATEGORIES, type CategoryKey } from "./data/categories";

const PROGRESS_TICK_MS = 100;
const PROGRESS_DURATION_MS = 6000;
const PROGRESS_STEP = (100 * PROGRESS_TICK_MS) / PROGRESS_DURATION_MS; // ≈1.667

function App() {
  /** 디자인 프레임의 기준 날짜로 시각 검증. 추후 new Date()로 교체. */
  const designDate = new Date(2026, 0, 14); // 2026.01.14 (수)

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

  /** 활성 카테고리 안 언론사 목록과 현재 인덱스 */
  const fieldPresses = PRESSES_BY_CATEGORY[fieldKey];
  const currentIndex = opened
    ? Math.max(
        0,
        fieldPresses.findIndex((p) => p.id === opened),
      )
    : 0;
  const openedPress = opened ? PRESS_BY_ID[opened] : null;

  /* === advance: 같은 카테고리 다음 언론사 → 카테고리 끝이면 다음 카테고리 첫 언론사 === */
  const advance = useCallback(() => {
    /* 1) 같은 카테고리 안에 다음이 있으면 그쪽으로 */
    if (currentIndex + 1 < fieldPresses.length) {
      setOpened(fieldPresses[currentIndex + 1].id);
      setProgress(0);
      return;
    }
    /* 2) 다음 카테고리로 (마지막이면 첫 카테고리로 wrap) */
    const ci = CATEGORIES.findIndex((c) => c.key === fieldKey);
    const nextCategory = CATEGORIES[(ci + 1) % CATEGORIES.length];
    const list = PRESSES_BY_CATEGORY[nextCategory.key];
    setFieldKey(nextCategory.key);
    setOpened(list.length > 0 ? list[0].id : null);
    setProgress(0);
  }, [currentIndex, fieldPresses, fieldKey]);

  /* === 진행 타이머 — view="list" + opened !== null일 때만 동작 === */
  useEffect(() => {
    if (view !== "list" || opened === null) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + PROGRESS_STEP;
        if (next >= 100) {
          /* setInterval 안에서 직접 advance 호출 — setState 큐가 batched */
          advance();
          return 0;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);
    return () => clearInterval(id);
  }, [view, opened, advance]);

  /* === 핸들러 === */
  const handlePillClick = (id: string) => {
    setSubscribed((prev) => {
      const next = new Set(prev);
      if (tab === "all") next.add(id);
      else next.delete(id);
      return next;
    });
    if (tab === "subscribed" && presses.length - 1 <= page * PAGE_SIZE) {
      setPage((p) => Math.max(0, p - 1));
    }
  };

  const handleOpen = (id: string) => {
    const press = PRESS_BY_ID[id];
    if (!press) return;
    const category = press.category;
    setFieldKey(category);
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
      /* 리스트로 직접 토글 — 아직 열린 게 없으면 현재 카테고리 첫 번째로 시작 */
      if (opened === null) {
        const list = PRESSES_BY_CATEGORY[fieldKey];
        if (list.length > 0) setOpened(list[0].id);
      }
      setProgress(0);
    }
  };

  /* ESC → 그리드로 복귀 (체크리스트 #14 뒤로 가기) */
  useEffect(() => {
    if (view !== "list") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView("grid");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  return (
    <div
      style={{
        width: "var(--content-w)",
        margin: "var(--space-64) auto 0",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-40)",
      }}
    >
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

      {view === "grid" || openedPress === null ? (
        <PressGrid
          presses={presses}
          page={page}
          pageCount={pageCount}
          mode={tab === "all" ? "subscribe" : "unsubscribe"}
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
  );
}

export default App;

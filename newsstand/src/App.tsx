import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { PressGrid } from "./components/PressGrid";
import { PressOpen } from "./components/PressOpen";
import { TICKER } from "./data/ticker";
import { PRESS_LIST, PAGE_SIZE } from "./data/press";
import type { CategoryKey } from "./data/categories";

const PROGRESS_TICK_MS = 100;
const PROGRESS_DURATION_MS = 6000;

function App() {
  /** 디자인 프레임의 기준 날짜로 시각 검증. 추후 new Date()로 교체. */
  const designDate = new Date(2026, 0, 14); // 2026.01.14 (수)

  /* === 상태 === */
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<ViewKey>("grid");
  const [page, setPage] = useState(0);
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

  /* Commit 13 시각 검증: 리스트 뷰 진입 시 첫 언론사 고정.
   * Commit 14에서 셀 클릭 → opened pressId로 정식 연결. */
  const [fieldKey, setFieldKey] = useState<CategoryKey>("general");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (view !== "list") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + (100 * PROGRESS_TICK_MS) / PROGRESS_DURATION_MS;
        return next >= 100 ? 0 : next;
      });
    }, PROGRESS_TICK_MS);
    return () => clearInterval(id);
  }, [view]);

  /* === 파생 값 === */
  const presses = useMemo(
    () =>
      tab === "all"
        ? PRESS_LIST
        : PRESS_LIST.filter((p) => subscribed.has(p.id)),
    [tab, subscribed],
  );
  const pageCount = Math.max(1, Math.ceil(presses.length / PAGE_SIZE));

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

  /* 리스트 뷰 더미 — 시각 검증용으로 PRESS_LIST 첫 항목 고정 */
  const openedPress = PRESS_LIST[0];
  const totalInTab = PRESS_LIST.filter(
    (p) => p.category === fieldKey,
  ).length;

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
        onViewChange={(next) => {
          setView(next);
          if (next === "list") setProgress(0);
        }}
      />

      {view === "grid" ? (
        <PressGrid
          presses={presses}
          page={page}
          pageCount={pageCount}
          mode={tab === "all" ? "subscribe" : "unsubscribe"}
          onPageChange={setPage}
          onPillClick={handlePillClick}
          onOpen={(id) => console.log("open:", id)}
        />
      ) : (
        <PressOpen
          press={openedPress}
          subscribed={subscribed.has(openedPress.id)}
          onSubscribeToggle={() => {
            /* PressOpen pill은 현재 구독 상태 기준 toggle (그리드 셀의 탭-기반 add/remove와 다름) */
            setSubscribed((prev) => {
              const next = new Set(prev);
              if (next.has(openedPress.id)) next.delete(openedPress.id);
              else next.add(openedPress.id);
              return next;
            });
          }}
          activeCategory={fieldKey}
          currentInTab={1}
          totalInTab={totalInTab}
          progress={progress}
          onCategoryChange={(k) => {
            setFieldKey(k);
            setProgress(0);
          }}
        />
      )}
    </div>
  );
}

export default App;

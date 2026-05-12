import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { PressGrid } from "./components/PressGrid";
import { FieldTab } from "./components/FieldTab";
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

  /* === Commit 12 시각 검증용 FieldTab 상태 ===
   * 진짜 advance 로직은 Commit 14에서 PressOpen과 함께 들어감. */
  const [fieldKey, setFieldKey] = useState<CategoryKey>("general");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + (100 * PROGRESS_TICK_MS) / PROGRESS_DURATION_MS;
        return next >= 100 ? 0 : next; // 임시: 6초마다 0으로 리셋
      });
    }, PROGRESS_TICK_MS);
    return () => clearInterval(id);
  }, []);

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
        onViewChange={setView}
      />

      <PressGrid
        presses={presses}
        page={page}
        pageCount={pageCount}
        mode={tab === "all" ? "subscribe" : "unsubscribe"}
        onPageChange={setPage}
        onPillClick={handlePillClick}
        onOpen={(id) => console.log("open:", id)}
      />

      {/* Commit 12 시각 검증 — Commit 13에서 <PressOpen> 안으로 이동 */}
      <FieldTab
        activeKey={fieldKey}
        currentInTab={3}
        totalInTab={81}
        progress={progress}
        onTabClick={(k) => {
          setFieldKey(k);
          setProgress(0);
        }}
      />
    </div>
  );
}

export default App;

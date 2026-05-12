import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { PressGrid } from "./components/PressGrid";
import { TICKER } from "./data/ticker";
import { PRESS_LIST, PAGE_SIZE } from "./data/press";

function App() {
  /** 디자인 프레임의 기준 날짜로 시각 검증. 추후 new Date()로 교체. */
  const designDate = new Date(2026, 0, 14); // 2026.01.14 (수)

  /* === 상태 (Commit 16에서 <Newsstand>로 이동) === */
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<ViewKey>("grid");
  const [page, setPage] = useState(0);
  /** 구독한 언론사 id 집합. Set으로 두면 중복/존재 체크가 O(1). */
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

  /* === 파생 값 === */
  /** 현재 탭에 보일 언론사 목록 */
  const presses = useMemo(
    () =>
      tab === "all"
        ? PRESS_LIST
        : PRESS_LIST.filter((p) => subscribed.has(p.id)),
    [tab, subscribed],
  );
  const pageCount = Math.max(1, Math.ceil(presses.length / PAGE_SIZE));

  /* === 핸들러 === */
  /** Pill 클릭 — 전체 탭이면 구독 추가, 구독 탭이면 해지 */
  const handlePillClick = (id: string) => {
    setSubscribed((prev) => {
      const next = new Set(prev); // 새 Set으로 만들어야 React가 변경을 인식
      if (tab === "all") next.add(id);
      else next.delete(id);
      return next;
    });
    /* 구독 탭에서 마지막 항목을 해지해 페이지가 비면 한 페이지 앞으로 */
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
          setPage(0); // 탭 전환 시 페이지 초기화
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
    </div>
  );
}

export default App;

import { useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { PressGrid } from "./components/PressGrid";
import { TICKER } from "./data/ticker";
import { PRESS_LIST, PAGE_SIZE } from "./data/press";

function App() {
  /** 디자인 프레임의 기준 날짜로 시각 검증. 추후 new Date()로 교체. */
  const designDate = new Date(2026, 0, 14); // 2026.01.14 (수)

  /* 임시 상태 — Commit 11에서 구독 Set과 연결, Commit 16에서 <Newsstand>로 이동 */
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<ViewKey>("grid");
  const [page, setPage] = useState(0);

  /* 전체 탭 = PRESS_LIST 그대로. 구독 탭은 Commit 11에서 필터링. */
  const presses = PRESS_LIST;
  const pageCount = Math.max(1, Math.ceil(presses.length / PAGE_SIZE));

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
        subCount={0}
        onTabChange={(next) => {
          setTab(next);
          setPage(0); // 탭 전환 시 페이지 초기화 (체크리스트 #10)
        }}
        onViewChange={setView}
      />

      <PressGrid
        presses={presses}
        page={page}
        pageCount={pageCount}
        mode={tab === "all" ? "subscribe" : "unsubscribe"}
        onPageChange={setPage}
        onPillClick={(id) => console.log("pill:", id)}
        onOpen={(id) => console.log("open:", id)}
      />
    </div>
  );
}

export default App;

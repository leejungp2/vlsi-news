import { useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { GridCell } from "./components/GridCell";
import { TICKER } from "./data/ticker";
import { PRESS_LIST } from "./data/press";

function App() {
  /** 디자인 프레임의 기준 날짜로 시각 검증. 추후 new Date()로 교체. */
  const designDate = new Date(2026, 0, 14); // 2026.01.14 (수)

  /* 임시 상태 — Commit 11에서 구독 Set과 연결, Commit 16에서 <Newsstand>로 이동 */
  const [tab, setTab] = useState<TabKey>("all");
  const [view, setView] = useState<ViewKey>("grid");

  /* Commit 6 시각 검증: page 1 첫 6개 (디자인 프레임 1행)을 셀처럼 보여줌 */
  const sample = PRESS_LIST.slice(0, 6);

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
        onTabChange={setTab}
        onViewChange={setView}
      />

      {/* Commit 9 시각 검증 — 1행(6칸) GridCell.
       * Commit 10에서 PressGrid로 교체되고 6×4 페이지네이션 들어감. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 1,
          background: "var(--line)",
          border: "1px solid var(--line)",
        }}
      >
        {sample.map((press) => (
          <div key={press.id} style={{ height: 96 }}>
            <GridCell
              press={press}
              mode={tab === "all" ? "subscribe" : "unsubscribe"}
              onPillClick={(id) => console.log("pill:", id)}
              onOpen={(id) => console.log("open:", id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

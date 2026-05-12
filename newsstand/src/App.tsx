import { useState } from "react";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { PressWordmark } from "./components/PressWordmark";
import { TabBar, type TabKey, type ViewKey } from "./components/TabBar";
import { SubscribePill } from "./components/SubscribePill";
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

      {/* Commit 8 시각 검증 — Commit 9에서 GridCell hover/focus 안으로 들어감 */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SubscribePill mode="subscribe" onClick={() => {}} />
        <SubscribePill mode="unsubscribe" onClick={() => {}} />
      </div>

      {/* 임시 wordmark 미리보기 — Commit 9·10에서 GridCell/PressGrid로 교체 */}
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
          <div
            key={press.id}
            style={{
              background: "var(--card)",
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PressWordmark press={press} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

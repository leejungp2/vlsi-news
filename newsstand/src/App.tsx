import { CATEGORIES } from "./data/categories";
import { PRESS_LIST, PAGE_SIZE } from "./data/press";
import { TICKER } from "./data/ticker";

console.log("[Commit 3] PRESS_LIST length =", PRESS_LIST.length);
console.log("[Commit 3] PAGE_SIZE =", PAGE_SIZE);
console.log("[Commit 3] CATEGORIES =", CATEGORIES);
console.log("[Commit 3] TICKER length =", TICKER.length);

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>뉴스스탠드</h1>
      <p>
        Commit 3 — 데이터 정의 완료 (press {PRESS_LIST.length}, ticker{" "}
        {TICKER.length}, categories {CATEGORIES.length})
      </p>
      <p style={{ fontSize: 12, color: "#5f6e76" }}>
        DevTools console에서 데이터를 확인하세요.
      </p>
    </div>
  );
}

export default App;

# 뉴스스탠드 개발 체크리스트

데스크톱 뉴스 포털 (1280×720 고정 캔버스, React 19 + Vite + TypeScript)
2주에 나눠 진행. 1주차에 그리드 + 구독까지, 2주차에 리스트 뷰 + 마무리.

---

## 이번 주 학습 목표

1. **React 19 + Vite + TypeScript** 환경을 직접 구성해 본다.
2. **CSS 변수로 디자인 토큰을 관리**하고, 디자인 프레임을 픽셀 단위로 재현한다.
3. **컴포넌트 분리와 props 설계**를 직접 해보고, 상태를 한 곳(`<Newsstand>`)에 모은다.
4. **AI를 동료로** 쓴다. 설계와 검증은 직접, 구현은 함께.
5. **접근성**(role/aria, focus-within, prefers-reduced-motion)을 처음부터 챙긴다.

---

## 개발 워크플로

각 체크리스트 항목마다 다음 사이클을 반복한다.

```
설계(직접) → 구현(AI 협업) → 셀프 리뷰 → 커밋
```

- **설계**: 컴포넌트 props/상태/CSS 구조를 짧게 메모.
- **구현**: AI에게 컴포넌트 단위로 위임. 디자인 토큰만 사용 (새 색상/폰트 도입 금지).
- **리뷰**: 디자인 프레임과 시각 비교 + 토큰 위반/접근성 누락 점검.
- **커밋**: 정해진 메시지 양식으로 직접 git commit.

---

## 커밋 메시지 양식

```
feat: #<번호> <컴포넌트/기능명>

- 확인내용: <디자인 시스템과 어떤 부분을 비교/검증했는지>
- 이해 안 됐던 부분: <개념/API/문법 중 새로 알아본 것>
```

예시:
```
feat: #6 PressWordmark 컴포넌트

- 확인내용: 디자인 시스템 6.5 항목과 비교, serif/italic/flag/accentChar props 모두 적용 확인
- 이해 안 됐던 부분: word-break: keep-all과 max-width 88%로 한글 줄바꿈 강제하는 방법
```

규칙:
- 메시지에 "Claude" 또는 `Co-Authored-By` 포함 금지.
- git 명령은 학습자 본인이 직접 실행 (AI는 명령만 출력).

---

## 1주차 — 그리드 + 구독 (Commits 1-11)

목표: 주 종료 시점에 6×4 그리드, 페이지네이션, 구독/해지가 동작하는 화면.

### Commit 1 — 프로젝트 초기 세팅
- [ ] `260428/newsstand/`에 Vite + React + TypeScript 프로젝트 생성
- [ ] 폴더 구조 (`src/components/`, `src/data/`, `src/styles/`)
- [ ] 폰트 로드: Pretendard Variable (CDN), IBM Plex Mono + Noto Serif KR (Google Fonts)
- [ ] 전역 reset CSS + `box-sizing: border-box`

### Commit 2 — 디자인 토큰 (CSS 변수)
- [ ] `:root`에 색상 토큰 (`--ink`, `--sub`, `--mute`, `--line`, `--soft`, `--card`, `--page`, `--accent`, `--accent-deep`)
- [ ] 타이포그래피 스케일 변수 (display/heading/body/list-item/caption/mono-tab)
- [ ] 스페이싱 스케일 (4, 8, 12, 16, 24, 32, 40, 48, 64)
- [ ] radius 토큰 (`--r-0`, `--r-sub`, `--r-pill`, `--r-badge`)

### Commit 3 — 언론사 데이터
- [ ] `data/press.ts` — 72개 언론사 객체 배열 (id, name, color, bg?, weight, family, italic? 등)
- [ ] `data/ticker.ts` — 티커용 헤드라인 데이터

### Commit 4 — `<Header>` 컴포넌트
- [ ] 좌측: 신문 아이콘(24×24, stroke `--ink`) + "뉴스스탠드" display 24/700
- [ ] 우측: 오늘 날짜 "YYYY. MM. DD. 요일" body 16/500 `--sub`
- [ ] flex space-between, height 29, y=58

### Commit 5 — `<Ticker>` 컴포넌트
- [ ] 2레인 나란히 (gap 8), height 49, bg `--soft`
- [ ] 각 레인: 언론사명 14/700 + 헤드라인 14/500 ellipsis
- [ ] 3.2초마다 전환, crossfade 0.55s, 두 레인 offset 처리
- [ ] `prefers-reduced-motion` 시 비활성화, hover/focus 시 정지

### Commit 6 — `<PressWordmark>` 컴포넌트
- [ ] press 객체 → 스타일드 워드마크 렌더링
- [ ] `bg`/`flag`/`family: "serif"`/`italic`/`underline`/`tracking`/`accent`/`accentChar`/`accentUnder` props 반영
- [ ] `inline-flex`, `flex-wrap: wrap`, `word-break: keep-all`, `max-width: 88%`, `line-height: 1.15`

### Commit 7 — `<TabBar>` 컴포넌트
- [ ] 좌측 (gap 24): "전체 언론사" / "내가 구독한 언론사" 탭 (활성 16/700 ink, 비활성 16/500 mute)
- [ ] 구독 배지: 20×20 `--r-badge`, bg `--accent`, 12/500 `rgba(255,255,255,0.7)`
- [ ] 우측 (gap 8): 리스트/그리드 뷰 토글 24×24
- [ ] `role="tablist"` / `role="tab"` / `aria-selected`, 배지 `aria-label`

### Commit 8 — `<SubscribePill>` 컴포넌트
- [ ] height 28, padding 0 12, `--r-pill`, bg `--card`, border 1px `--line`
- [ ] 텍스트 12/500 `--sub`, 좌측 10×10 plus/minus 아이콘
- [ ] 그림자 `0 1px 2px rgba(20,33,43,0.04)`

### Commit 9 — `<GridCell>` 컴포넌트
- [ ] 기본: `<PressWordmark>` 중앙 정렬, bg `--card`
- [ ] hover/`:focus-within`: bg `--soft`, 워드마크 → `<SubscribePill>` 스왑
  - 전체 탭: "+ 구독하기" / 구독 탭: "− 해지하기"
- [ ] 클릭 시 `onOpen(pressId)` 호출

### Commit 10 — `<PressGrid>` + `<Chevron>` + 페이지네이션
- [ ] CSS grid 6×4, gap 1, 930×388, bg `--line`, border 1px `--line`
- [ ] `<Chevron>` 24×40, stroke `--mute` 1.4, position left 103 / right 1153, top 430
- [ ] disabled 시 opacity 0 (레이아웃 유지), `<button>` + `aria-label`
- [ ] 전체 탭 3페이지(×24), 구독 탭 동적 페이지(≤24/페이지)
- [ ] 탭 전환 시 page=0 초기화

### Commit 11 — 구독/해지 기능
- [ ] `subscribed: Set<pressId>` 상태 (`<Newsstand>` 최상위)
- [ ] `onSubscribe(id)` / `onUnsubscribe(id)` 핸들러
- [ ] 구독 탭: subscribed ID 기준 필터링, 빈 셀 흰색 유지
- [ ] 탭 배지 카운트 실시간 업데이트

**1주차 종료 시 자가 검증**
- [ ] 디자인 프레임 "기본"/"hover-구독"/"hover-해지"/"페이지2"와 시각 일치
- [ ] 1280×720 캔버스, 좌우 거터 175, 콘텐츠 930
- [ ] `prefers-reduced-motion`으로 ticker 정지 확인
- [ ] 키보드만으로 구독/해지 가능

---

## 2주차 — 리스트 뷰 + 마무리 (Commits 12-16)

### Commit 12 — `<FieldTab>` (카테고리 탭)
- [ ] 6개 탭 (종합/경제, 방송/통신, IT, 스포츠/연예, 매거진/전문지, 지역)
- [ ] height 40, bg `--soft`, border 1px `--line`, 각 탭 `flex: 1`, padding 0 16
- [ ] 비활성: 14/500 sub. 활성: bg `--accent`, 라벨 14/700 `#FFFFFF`, progress overlay `--accent-deep`
- [ ] 우측 카운터 "1/81" IBM Plex Mono 12/500
- [ ] progress 0→100% linear 6초 (`setInterval(tick, 100)` / 6000ms)
- [ ] 완료 시 `currentInTab++`, 마지막이면 다음 탭, 모두 끝나면 첫 탭으로

### Commit 13 — `<PressOpen>` (리스트 뷰)
- [ ] 930×388, bg `--card`, border 1px `--line` (상단 border 없음)
- [ ] 내부 padding 24 32
- [ ] 헤드 행: wordmark(scale 1.05) + 편집 시간 + `<SubscribePill>`
- [ ] 본문: 좌 340px (이미지 박스 340×188 gradient + 헤드라인 16/700 lh 1.45) + 우 (기사 6개 14/500 lh 1.5 + footnote 12/500 mute)
- [ ] 상단에 `<FieldTab>` 배치

### Commit 14 — 언론사 클릭 → 리스트 뷰 전환
- [ ] `opened: pressId | null` 상태
- [ ] `onOpen(id)` 호출 시 그리드 → `<PressOpen>` 전환
- [ ] 진입 탭 = 해당 언론사의 primary category
- [ ] progress 0에서 시작, FieldTab 타이머 시작
- [ ] 뒤로 가기(그리드 복귀)

### Commit 15 — 접근성 마무리
- [ ] 탭바 role/aria 검증, chevron disabled attribute 검증
- [ ] 구독 배지 `aria-label` 동적 업데이트
- [ ] 셀 hover pill의 `:focus-within` 동작
- [ ] ticker hover/focus 정지, `prefers-reduced-motion` 비활성화
- [ ] 색상 대비 WCAG AA 점검 (`--mute` on white ≥ 14px+)

### Commit 16 — 레이아웃 고정 + 전체 조립
- [ ] `<Newsstand>` 최상위 상태 집중 (`tab`, `page`, `opened`, `tabKey`, `progress`, `currentInTab`, `subscribed`)
- [ ] 캔버스 1280×720, 좌우 거터 175, 콘텐츠 930
- [ ] chevron position (left 103 / right 1153)
- [ ] 1280px 미만 뷰포트 scale-down 처리
- [ ] 6개 디자인 프레임 시각 QA (기본/hover-구독/hover-해지/페이지2/리스트뷰-진행중/리스트뷰-전환직전)

**2주차 종료 시 자가 검증**
- [ ] 6개 디자인 프레임 모두 시각적으로 일치
- [ ] 접근성 점검 통과

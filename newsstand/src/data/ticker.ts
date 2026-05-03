/**
 * 자동롤링 뉴스 티커 데이터 (디자인 §6.2).
 *
 * 2개 레인이 3.2초마다 다음 항목으로 전환되며 crossfade 0.55s.
 * 두 레인이 동기화되지 않도록 컴포넌트에서 offset(예: 1.6s)을 줌.
 *
 * design.pdf §6.2:
 *   [0] press name 14/700 ink, width 56 fixed
 *   [1] title     14/500 ink, ellipsis, flex 1
 */

export type TickerItem = {
  press: string; // 언론사명 (디자인 좌측 56px 고정폭)
  title: string; // 헤드라인 (우측 flex 1, ellipsis)
};

/* 디자인 프레임에 등장하는 첫 두 항목 */
export const TICKER: TickerItem[] = [
  {
    press: "연합뉴스",
    title: "[속보] 도심 공원 '조용한 독서존' 시범 운영… 시민 호응 …",
  },
  {
    press: "한국경제",
    title: "중소기업 ESG 전담 인력 채용 확대… 지속 가능성 주목",
  },
  /* 추가 헤드라인 — 3.2초마다 회전하므로 충분한 양 */
  {
    press: "매일경제",
    title: "수도권 광역버스, 평일 새벽 출근시간대 증편 확정",
  },
  {
    press: "동아일보",
    title: "겨울철 미세먼지 저감 조치… 공공기관 차량 2부제 시행",
  },
  {
    press: "조선일보",
    title: "20대 청년층 자격증 취득 5년새 두 배… 실용 자격 인기",
  },
  {
    press: "서울경제",
    title: "스타트업 생태계 활성화 위한 규제 샌드박스 신청 사상 최대",
  },
  {
    press: "KBS",
    title: "올겨울 강설량 평년 웃돌 전망… 도로 결빙 주의 당부",
  },
  {
    press: "SBS",
    title: "전국 도서관 야간 개방 확대 시범 사업, 호응 속 정식화",
  },
];

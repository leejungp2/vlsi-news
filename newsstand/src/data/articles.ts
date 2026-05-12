/**
 * 리스트 뷰 더미 기사 데이터 (디자인 §6.13 + plan 프레임 5·6).
 *
 * 디자인 프레임에 등장하는 두 언론사(서울경제·매일경제)만 정확히 채우고,
 * 나머지는 fallback으로 generic 헤드라인 6개 + 그라데이션을 자동 부여.
 */

export type PressArticles = {
  /** 헤드라인 이미지 자리(340×188)에 들어갈 linear-gradient 문자열 */
  imageGradient: string;
  /** 헤드라인 이미지 아래 큰 제목 (16/700) */
  headline: string;
  /** 우측 기사 6개 (14/500 ellipsis) */
  items: string[];
  /** 우측 하단 footnote (12/500 mute) */
  footnote: string;
};

const DEFAULT_GRADIENTS = [
  "linear-gradient(135deg, #C9D6FF 0%, #E2E2E2 100%)",
  "linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)",
  "linear-gradient(135deg, #A1FFCE 0%, #FAFFD1 100%)",
  "linear-gradient(135deg, #B7CFE8 0%, #2E5BBA 100%)",
  "linear-gradient(135deg, #FCB69F 0%, #FFECD2 100%)",
  "linear-gradient(135deg, #D9AFD9 0%, #97D9E1 100%)",
] as const;

const GENERIC_ITEMS = [
  "경제 지표 회복세… 소비자 신뢰 지수 두 달 연속 상승",
  "정부, 첨단 산업 단지 5곳 추가 지정… 입주 신청 폭주",
  "AI 인재 양성 위한 산학 협력 프로그램 본격 시행",
  "수도권 광역 교통망 확충 계획 발표… 출퇴근 시간 단축",
  "친환경 에너지 전환 가속… 태양광 발전 비중 사상 최대",
  "청년 창업 지원 사업 신청 마감 임박… 자격 요건 완화",
];

const GENERIC_FOOTNOTE = "편집국 종합 · 최신 업데이트 기준";

/** 디자인 프레임 5·6에 등장하는 언론사 데이터 */
const SEED: Record<string, PressArticles> = {
  "seoul-economy": {
    imageGradient: "linear-gradient(135deg, #2E5BBA 0%, #4F86E0 100%)",
    headline: "글로벌 반도체 공급망 재편 가속… 국내 기업 수혜 기대",
    items: [
      "산업부, 첨단 반도체 R&D 예산 30% 증액 확정",
      "삼성·SK, 미국 현지 공장 가동률 연내 90% 회복 목표",
      "중소 팹리스 60곳, 정부 보증 융자 자격 부여",
      "메모리 가격 4분기 연속 상승… 업황 회복 신호",
      "차량용 반도체 국산화율 35%까지 끌어올린다",
      "ESS 시장 폭증… 배터리·반도체 동반 수혜",
    ],
    footnote: "서울경제 · 5분 전 업데이트",
  },
  "maeil-economy": {
    imageGradient: "linear-gradient(135deg, #14212B 0%, #5F6E76 100%)",
    headline: "수도권 부동산 거래량 회복… 매매가 상승 전환",
    items: [
      "강남 3구 아파트 거래량 전월 대비 18% 증가",
      "전세 수급 안정세… 신규 입주 물량 분산 효과",
      "정부, 분양가 상한제 손질 검토… 공급 확대 시그널",
      "지방 광역시 청약 경쟁률 두 자릿수로 반등",
      "건설사 미분양 재고 정상 수준 회복 임박",
      "재건축 안전 진단 기준 완화 후속 입법 본격화",
    ],
    footnote: "매일경제 · 12분 전 업데이트",
  },
};

/** 결정적 fallback — 같은 pressId에는 항상 같은 데이터 반환 */
function fallbackFor(pressId: string, pressName: string): PressArticles {
  /* 문자열 → 안정적인 정수 해시 (FNV-1a 32bit, 가벼움) */
  let h = 0x811c9dc5;
  for (let i = 0; i < pressId.length; i++) {
    h ^= pressId.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const gradient = DEFAULT_GRADIENTS[h % DEFAULT_GRADIENTS.length];
  /* GENERIC_ITEMS를 해시 기반으로 회전 — 언론사마다 시작점 다르게 */
  const start = h % GENERIC_ITEMS.length;
  const items = Array.from(
    { length: 6 },
    (_, i) => GENERIC_ITEMS[(start + i) % GENERIC_ITEMS.length],
  );
  /* 헤드라인은 첫 아이템을 그대로 사용 */
  return {
    imageGradient: gradient,
    headline: items[0],
    items,
    footnote: `${pressName} · ${GENERIC_FOOTNOTE}`,
  };
}

export function getArticlesFor(pressId: string, pressName: string): PressArticles {
  return SEED[pressId] ?? fallbackFor(pressId, pressName);
}

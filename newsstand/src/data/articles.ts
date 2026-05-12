/**
 * 리스트 뷰 더미 기사 데이터 (디자인 §6.10).
 *
 * 디자인 프레임 6·7에 등장하는 두 언론사(SBS Biz·아시아경제)만 정확히 채우고,
 * 나머지는 fallback으로 generic 헤드라인 6개를 자동 부여.
 *
 * 헤드라인 이미지는 모두 동일한 placeholder (디자인 §6.10):
 *   linear-gradient(135deg, #EFF1F6, #DDE3EC) + 중앙 "headline image" 텍스트
 * 데이터에는 텍스트만 두고 색은 CSS에서 처리.
 */

export type PressArticles = {
  /** 헤드라인 이미지 아래 큰 제목 (16/700) */
  headline: string;
  /** 우측 기사 6개 (14/500 ellipsis, 3×3 정사각 bullet) */
  items: string[];
};

const GENERIC_ITEMS = [
  "경제 지표 회복세… 소비자 신뢰 지수 두 달 연속 상승",
  "정부, 첨단 산업 단지 5곳 추가 지정… 입주 신청 폭주",
  "AI 인재 양성 위한 산학 협력 프로그램 본격 시행",
  "수도권 광역 교통망 확충 계획 발표… 출퇴근 시간 단축",
  "친환경 에너지 전환 가속… 태양광 발전 비중 사상 최대",
  "청년 창업 지원 사업 신청 마감 임박… 자격 요건 완화",
];

/** 디자인 프레임 6·7에 등장하는 언론사 데이터 */
const SEED: Record<string, PressArticles> = {
  "sbs-biz": {
    headline: "전기요금도 이제 '알림으로 다독다독'… 생활관리 습관 확산",
    items: [
      "출근길 드라마 끊김 이별? 지하철 와이파이, 살짝 더 빨라졌다",
      "\"기다림이 폭신해졌어요\" 동네 버스정류장 의자, 새 단장",
      "데이터 걱정 내려놓기 실험… 통신사, '마음 편한 요금제' 선보여",
      "잠들기 전에 보는 조용한 영상 한 편… OTT, 힐링 추천 기능 도입",
      "\"길 잃지 않게 도와줄게요\" 친절해진 환승 안내 목소리",
      "퇴근 시간 맞춰 환하게 '찰칵'… 스마트 조명, 집이 먼저 반겨준다",
    ],
  },
  "asia-economy": {
    headline: "기업, '워라밸 교육 프로그램' 자율 도입 확대",
    items: [
      "지자체, 소상공인 대상 친절 응대 교육 지원",
      "직장인 스트레스 관리 위한 '마음건강 상담' 확대",
      "생활밀착 스타트업, 직장인 대상 서비스 잇단 출시",
      "기업문화 개선 사례 공유 확산… 자발적 참여 늘어",
      "재택·출근 혼합 근무, 중견기업까지 확대 움직임",
      "사내 커뮤니케이션 플랫폼 고도화 추진",
    ],
  },
};

/** 결정적 fallback — 같은 pressId에는 항상 같은 회전 시작 인덱스를 반환 */
function fallbackFor(pressId: string): PressArticles {
  /* FNV-1a 32bit 해시 */
  let h = 0x811c9dc5;
  for (let i = 0; i < pressId.length; i++) {
    h ^= pressId.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const start = h % GENERIC_ITEMS.length;
  const items = Array.from(
    { length: 6 },
    (_, i) => GENERIC_ITEMS[(start + i) % GENERIC_ITEMS.length],
  );
  return { headline: items[0], items };
}

export function getArticlesFor(pressId: string): PressArticles {
  return SEED[pressId] ?? fallbackFor(pressId);
}

/** 디자인 §6.10 — 모든 헤드라인 이미지가 공유하는 placeholder 텍스트 */
export const HEADLINE_IMAGE_PLACEHOLDER = "headline image";

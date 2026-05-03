/**
 * 언론사 데이터 (디자인 §6.5 PressWordmark 스펙 기반).
 *
 * 디자인 프레임 1·2 (그리드 page 1·2)에 등장하는 48개는 시각 사양을 정확히 반영.
 * page 3 (24개)은 렌더 변형(serif/italic/flag/accent/bg-chip 등)이 골고루
 * 등장하도록 그럴듯한 한국 언론사로 채워 넣음.
 */

import type { CategoryKey } from "./categories";

export type Press = {
  id: string;
  name: string;
  category: CategoryKey;

  /* === Wordmark 스타일 (디자인 §6.5) === */
  color?: string; // 텍스트 색상 (기본 var(--ink))
  bg?: string; // filled chip 배경 (있으면 텍스트 white 권장)
  weight?: 400 | 500 | 700; // 기본 700
  family?: "sans" | "serif"; // 기본 "sans"
  italic?: boolean;
  underline?: boolean;
  tracking?: string; // letter-spacing, ex "0.08em"

  /* 일부 글자만 강조 */
  accent?: string; // 강조 색
  accentChars?: number[]; // 강조 색이 적용될 글자 인덱스들 (연속이든 비연속이든)
  accentUnder?: number[]; // accent 색 underline이 적용될 글자 인덱스들
  accentBg?: boolean; // accentChars가 색 대신 chip 배경으로 처리

  /* 기타 플래그 */
  flag?: boolean; // 빨간 국기 글리프 (아시아경제)
  latin?: boolean; // 라틴 텍스트 — 한글 -0.01em tracking 비활성
  small?: boolean; // 14px (긴 라틴 이름)
};

/* ============================================================
 * Page 1 (cells 1-24) — 디자인 프레임 01·02 정확히 반영
 * ============================================================ */
const PAGE_1: Press[] = [
  { id: "seoul-economy", name: "서울경제", category: "general" },
  { id: "dailian", name: "데일리안", category: "general" },
  {
    id: "herald-economy",
    name: "헤럴드경제",
    category: "general",
    accent: "#1A75CF",
    accentChars: [0],
  },
  {
    id: "sbs-biz",
    name: "SBSBiz",
    category: "broadcasting",
    latin: true,
    tracking: "0.04em",
    accent: "#1A75CF",
    accentChars: [3, 4, 5],
  },
  { id: "sege-ilbo", name: "세계일보", category: "general" },
  {
    id: "asia-economy",
    name: "아시아경제",
    category: "general",
    flag: true,
  },

  {
    id: "edaily",
    name: "이데일리",
    category: "general",
    color: "#FFFFFF",
    bg: "#E63946",
  },
  {
    id: "chosun",
    name: "朝鮮日報",
    category: "general",
    family: "serif",
    tracking: "0.08em",
  },
  {
    id: "inews24",
    name: "아이뉴스24",
    category: "it",
    color: "#1A75CF",
  },
  { id: "financial-news", name: "파이낸셜뉴스", category: "general" },
  {
    id: "sports-seoul",
    name: "스포츠서울",
    category: "sports",
    underline: true,
    color: "#1A75CF",
  },
  { id: "sports-donga", name: "스포츠동아", category: "sports" },

  {
    id: "munhwa-ilbo",
    name: "석간 문화일보",
    category: "general",
    accentUnder: [3, 4, 5],
  },
  {
    id: "kbs-world",
    name: "KBSWORLD",
    category: "broadcasting",
    color: "#FFFFFF",
    bg: "#1F4FA0",
    latin: true,
    tracking: "0.05em",
  },
  {
    id: "korea-joongang-daily",
    name: "Korea JoongAng Daily",
    category: "general",
    family: "serif",
    latin: true,
    tracking: "0.04em",
    small: true,
  },
  {
    id: "insight",
    name: "Insight",
    category: "magazine",
    family: "serif",
    italic: true,
    color: "#C0392B",
    latin: true,
  },
  { id: "law-broadcast", name: "법률방송뉴스", category: "broadcasting" },
  {
    id: "sisajournal-e",
    name: "시사저널e.",
    category: "magazine",
    color: "#C0392B",
  },

  { id: "rural-broadcast", name: "한국농어촌방송", category: "broadcasting" },
  { id: "joynews24", name: "조이뉴스24", category: "sports" },
  { id: "energy-economy", name: "에너지경제", category: "general" },
  {
    id: "business-post",
    name: "BUSINESS POST",
    category: "magazine",
    family: "serif",
    latin: true,
    tracking: "0.06em",
    small: true,
  },
  {
    id: "ceoscore-daily",
    name: "CEO스코어데일리",
    category: "general",
    color: "#1A75CF",
    small: true,
  },
  { id: "knn", name: "KNN", category: "regional", color: "#C0392B" },
];

/* ============================================================
 * Page 2 (cells 25-48) — 디자인 프레임 04 정확히 반영
 * ============================================================ */
const PAGE_2: Press[] = [
  {
    id: "korea-herald",
    name: "The Korea Herald",
    category: "general",
    family: "serif",
    italic: true,
    color: "#1A75CF",
    latin: true,
    small: true,
  },
  { id: "mbc", name: "MBC", category: "broadcasting", latin: true },
  { id: "newstapa", name: "뉴스타파", category: "magazine" },
  { id: "newdaily", name: "NewDaily", category: "general", latin: true },
  { id: "kookmin-ilbo", name: "국민일보", category: "general" },
  {
    id: "ilgan-sports",
    name: "일간스포츠",
    category: "sports",
    underline: true,
    color: "#C0392B",
  },

  { id: "kyunghyang", name: "경향신문", category: "general" },
  { id: "zdnet-korea", name: "ZDNET Korea", category: "it", latin: true },
  {
    id: "mydaily",
    name: "mydaily",
    category: "sports",
    italic: true,
    color: "#C0392B",
    latin: true,
  },
  {
    id: "mt-money-today",
    name: "MT머니투데이",
    category: "general",
    color: "#C0392B",
  },
  { id: "sbs", name: "SBS", category: "broadcasting", color: "#1A75CF", latin: true },
  {
    id: "ohmynews",
    name: "OhmyNews",
    category: "general",
    italic: true,
    color: "#E89B2C",
    latin: true,
  },

  {
    id: "maeil-economy",
    name: "매일경제",
    category: "general",
    underline: true,
  },
  { id: "mbn", name: "MBN", category: "broadcasting", color: "#E89B2C", latin: true },
  { id: "ytn", name: "YTN", category: "broadcasting", latin: true },
  { id: "sisaweek", name: "시사위크", category: "magazine", color: "#1A75CF" },
  {
    id: "digital-today",
    name: "Digital Today",
    category: "it",
    family: "serif",
    latin: true,
    small: true,
  },
  {
    id: "data-news",
    name: "dataNews",
    category: "it",
    italic: true,
    color: "#C0392B",
    latin: true,
  },

  { id: "univ-news", name: "한국대학신문", category: "magazine" },
  { id: "seoul-finance", name: "서울파이낸스", category: "general" },
  { id: "x-sports-news", name: "엑스포츠뉴스", category: "sports" },
  { id: "max-movie", name: "맥스무비", category: "sports" },
  { id: "obs", name: "OBS", category: "regional", latin: true },
  {
    id: "sonyon-hankook-ilbo",
    name: "소년한국일보",
    category: "magazine",
    color: "#1A75CF",
  },
];

/* ============================================================
 * Page 3 (cells 49-72) — 디자인 프레임에는 미노출, 변형 다양성 보장용
 * ============================================================ */
const PAGE_3: Press[] = [
  { id: "hani", name: "한겨레", category: "general", underline: true },
  {
    id: "donga-ilbo",
    name: "東亞日報",
    category: "general",
    family: "serif",
    tracking: "0.06em",
  },
  { id: "joongang", name: "중앙일보", category: "general" },
  { id: "hankook-ilbo", name: "한국일보", category: "general" },
  { id: "nocut-news", name: "노컷뉴스", category: "broadcasting" },
  { id: "kbs", name: "KBS", category: "broadcasting", latin: true },

  {
    id: "tv-chosun",
    name: "TV CHOSUN",
    category: "broadcasting",
    color: "#FFFFFF",
    bg: "#0E1936",
    latin: true,
    small: true,
  },
  { id: "jtbc", name: "JTBC", category: "broadcasting", color: "#C0392B", latin: true },
  { id: "channel-a", name: "채널A", category: "broadcasting" },
  { id: "news1", name: "News1", category: "broadcasting", latin: true },
  { id: "newsis", name: "뉴시스", category: "broadcasting" },
  { id: "wow-tv", name: "한국경제TV", category: "broadcasting" },

  { id: "digital-times", name: "디지털타임스", category: "it" },
  {
    id: "etnews",
    name: "전자신문",
    category: "it",
    color: "#1A75CF",
  },
  { id: "money-s", name: "머니S", category: "general" },
  {
    id: "biz-hankook",
    name: "비즈한국",
    category: "magazine",
    color: "#FFFFFF",
    bg: "#5A2A82",
  },
  {
    id: "korea-times",
    name: "The Korea Times",
    category: "magazine",
    family: "serif",
    latin: true,
    tracking: "0.04em",
    small: true,
  },
  { id: "maek-economy", name: "매경이코노미", category: "magazine" },

  { id: "sisa-in", name: "시사IN", category: "magazine", color: "#C0392B" },
  { id: "weekly-kh", name: "주간경향", category: "magazine" },
  { id: "game-donga", name: "게임동아", category: "it" },
  {
    id: "kormedi",
    name: "kormedi",
    category: "magazine",
    italic: true,
    color: "#1A75CF",
    latin: true,
  },
  {
    id: "bbs-news",
    name: "BBS NEWS",
    category: "broadcasting",
    color: "#1F1F1F",
    bg: "#FFD43B",
    latin: true,
    tracking: "0.06em",
  },
  { id: "kbc", name: "광주방송", category: "regional", color: "#C0392B" },
];

export const PRESS_LIST: Press[] = [...PAGE_1, ...PAGE_2, ...PAGE_3];

/** id → Press 빠른 lookup (구독/리스트 뷰 진입 시 사용) */
export const PRESS_BY_ID: Record<string, Press> = Object.fromEntries(
  PRESS_LIST.map((p) => [p.id, p]),
);

/** 페이지 크기 (전체 언론사 그리드는 6×4 = 24/page) */
export const PAGE_SIZE = 24;

/**
 * 디자인 시스템 §6.9 — Field tab의 6개 카테고리.
 * 키는 영문(상수 비교용), 라벨은 디자인 표기 그대로(렌더용).
 */

export type CategoryKey =
  | "general"
  | "broadcasting"
  | "it"
  | "sports"
  | "magazine"
  | "regional";

export type Category = {
  key: CategoryKey;
  label: string;
};

export const CATEGORIES: Category[] = [
  { key: "general", label: "종합/경제" },
  { key: "broadcasting", label: "방송/통신" },
  { key: "it", label: "IT" },
  { key: "sports", label: "스포츠/연예" },
  { key: "magazine", label: "매거진/전문지" },
  { key: "regional", label: "지역" },
];

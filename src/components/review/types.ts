import type { ReviewCard } from "@/src/services/cards";

export type McqReviewCard = ReviewCard & {
  options?: string[];
  correctIndex?: number | null;
  wrongExplanations?: string[];
  cardType?: "basic" | "mcq";
};

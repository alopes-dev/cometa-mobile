export type RatingCriterion = {
  key: string;
  label: string;
};

export type CategoryRating = {
  overall: number;
  criteria: Record<string, number>;
};

export type OrderRating = {
  restaurant: CategoryRating;
  driver: CategoryRating;
};

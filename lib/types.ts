// lib/types.ts
export type Flower = {
  id: number;
  latin: string;
  common: string;
  image_name: string | null;

  // numeric codes stored in the DB
  height_code: number | null;
  bloom_code: number | null;
  sun_code: number | null;
  moist_code: number | null;
  cat_code: number | null;
  deer_code: number | null;
  wild_code: number | null;
  soil_code: number | null;

  // free-text fields
  region: string | null;
  design_function: string | null;
  gardening_tips: string | null;
  wildlife_comments: string | null;

  credit_code: number | null;

  // your data uses ranges like "5.4–7.1"
  ph: string | null;
};

export type FlowerRow = Flower & {
  // Joined lookup data for display (Supabase returns arrays even for single joins)
  height?: { height_display: string }[] | null;
  categories?: { cat_display: string }[] | null;
};
export type UpsertInput = Omit<Flower, 'id'> & { id?: number };
import { Role } from "@prisma/client";

export interface member {
  id: string;
  role: Role;
  image: string | null;
  name: string;
  myself: boolean;
  familyId: string;
}

export interface family {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}
export interface invitation {
  id: string;
  inviterId: string;
  inviterName: string;
  familyName: string;
  familyImage: string | null;
  seen: boolean;
}

export interface error {
  error: string;
}

export interface success {
  success: string;
}

export type actionResponse = error | success;

export interface recipe {
  id: string;
  title: string;
  prep_time: number | null;
  total_time: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  recommendations: string | null;
  origin: string | null;
  visibility: string;
  image: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface draftRecipe {
  id: string;
  title: string | null;
  prep_time: number | null;
  total_time: number | null;
  servings: number;
  ingredients: string[];
  steps: string[];
  recommendations: string | null;
  origin: string | null;
  visibility: string | null;
  image: string | null;
}

export type recipeAndAuthor = recipe & {
  author_name: string;
  author_image: string | null;
  author_id: string;
  favorite: boolean;
};

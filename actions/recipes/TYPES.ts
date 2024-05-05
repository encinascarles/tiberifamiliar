"use server";
import { error, recipeAndAuthor } from "@/types";

//--------------- GLOBAL TYPES --------------:

export type recipesResponse = recipeAndAuthor[] | error;
export type recipesPaginationResponse =
  | {
      recipes: recipeAndAuthor[];
      total: number;
    }
  | error;

import { Recipe } from "@prisma/client";
import RecipeCard from "./RecipeCard";

interface RecipesGridProps {
  recipes: (Recipe & {
    author: { username: string | null; image: string | null };
  })[];
}

const RecipesGrid: React.FC<RecipesGridProps> = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
      {recipes.map((recipe, i) => (
        <RecipeCard
          key={i}
          title={recipe.title}
          id={recipe.id}
          username={recipe.author.username}
          user_image={recipe.author.image}
          prep_time={recipe.prep_time}
          total_time={recipe.total_time}
          image={recipe.image}
          personal={false}
        />
      ))}
    </div>
  );
};

export default RecipesGrid;

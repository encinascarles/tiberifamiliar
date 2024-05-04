type recipesGridProps = {
  children: React.ReactNode;
};

const RecipesGrid: React.FC<recipesGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
      {children}
    </div>
  );
};

export default RecipesGrid;

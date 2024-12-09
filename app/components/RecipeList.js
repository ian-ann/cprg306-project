import { useEffect, useState } from "react";

const RecipeList = ({ items, onItemSelect }) => {
  const [recipes, setRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(10);

  async function getAllRecipes() {
    try {
      const response = await fetch("/api/recipes");
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllRecipes();
  }, []);

  const handleLoadMore = () => {
    setVisibleRecipes((prevVisibleRecipes) => prevVisibleRecipes + 3);
  };

  if (!recipes || recipes.length === 0) {
    return null; // Render nothing if recipes is null or empty
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipes.slice(0, visibleRecipes).map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onItemSelect(recipe)}
          >
            {recipe.MealThumb ? (
              <img src={recipe.MealThumb} alt={recipe.title} className="w-full h-32 sm:h-48 object-cover" />
            ) : null}
            <div className="p-4">
              <h3 className="text-lg font-bold">{recipe.title}</h3>
              <p className="text-gray-600">{recipe.description}</p>
            </div>
          </div>
        ))}
      </div>
      {visibleRecipes < recipes.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
"use client";

import { useState } from 'react';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
      const data = await response.json();
      setRecipes(data.recipes);

      // Insert each fetched recipe into the database
      for (const recipe of data.recipes) {
        await fetch('/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipe),
        });
      }
    } catch (error) {
      console.error('Failed to fetch recipes', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchRecipes}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Recipes
      </button>
      {loading && <p>Loading...</p>}
      <div className="mt-4">
        {recipes && recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.idMeal} className="mb-2">
                <h3 className="text-lg font-bold">{recipe.strMeal}</h3>
                <p>{recipe.strInstructions}</p>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-32 h-32 object-cover" />
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
}
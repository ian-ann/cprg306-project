import { useState, useEffect } from 'react';

export default function RecipeForm({ initialData, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [Instructions, setInstructions] = useState(initialData?.Instructions || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setInstructions(initialData.Instructions || '');
      if (initialData.id) {
        fetchIngredients(initialData.id);
      } else {
        setIngredients(initialData.ingredients || []);
      }
    }
  }, [initialData]);

  const fetchIngredients = async (id) => {
    try {
      const response = await fetch(`/api/ingredients?recipeId=${id}`);
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error('Failed to fetch ingredients', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipeData = {
      ...(initialData?.id && { id: initialData.id }),
      title,
      Instructions,
      ingredients: ingredients.map(ingredient => ({
        ingredientName: ingredient.ingredientName || ingredient.name,
        measures: ingredient.measures || ingredient.measure,
      })),
    };

    onSubmit(recipeData);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredientName: '', measures: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label htmlFor="instructions">Instructions:</label>
        <textarea
          id="instructions"
          value={Instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label>Ingredients:</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Name"
              value={ingredient.ingredientName || ingredient.name || ''}
              onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
              className="border p-2 rounded w-full mr-2"
            />
            <input
              type="text"
              placeholder="Measure"
              value={ingredient.measures || ingredient.measure || ''}
              onChange={(e) => handleIngredientChange(index, 'measures', e.target.value)}
              className="border p-2 rounded w-full mr-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Ingredient
        </button>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4">Submit</button>
    </form>
  );
}
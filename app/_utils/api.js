// api.js
export async function fetchAllRecipes() {
  try {
    const response = await fetch("/api/recipes");
    if (!response.ok) {
      console.log(response.statusText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchIngredients(recipeId) {
  try {
    const response = await fetch(`/api/ingredients?recipeId=${recipeId}`);
    if (!response.ok) {
      console.log(response.statusText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const updateIngredients = async (recipeId, updatedIngredients) => {
  try {
    // Fetch existing ingredients
    const existingIngredientsResponse = await fetch(`/api/ingredients?recipeId=${recipeId}`);
    const existingIngredients = await existingIngredientsResponse.json();

    console.log('Existing ingredients:', existingIngredients);

    // Determine ingredients to delete
    const ingredientsToDelete = existingIngredients.filter(
      (existingIngredient) =>
        !updatedIngredients.some(
          (updatedIngredient) => updatedIngredient.id === existingIngredient.id
        )
    );

    console.log('Ingredients to delete:', ingredientsToDelete);

    // Determine ingredients to insert
    const ingredientsToInsert = updatedIngredients.filter(
      (updatedIngredient) => !existingIngredients.some(
        (existingIngredient) => updatedIngredient.id === existingIngredient.id
      )
    );

    console.log('Ingredients to insert:', ingredientsToInsert);

    // Delete ingredients
    for (const ingredient of ingredientsToDelete) {
      await fetch(`/api/ingredients/${ingredient.id}`, {
        method: 'DELETE',
      });
    }

    // Insert ingredients
    for (const ingredient of ingredientsToInsert) {
      await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          ingredientName: ingredient.ingredientName,
          measures: ingredient.measures,
        }),
      });
    }
  } catch (error) {
    console.error('Failed to update ingredients', error);
  }
};
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_utils/auth-context';
import RecipeForm from '../components/RecipeForm';
import RecipeList from '../components/RecipeList';
import Footer from '../components/Footer';
import { fetchAllRecipes, fetchIngredients, updateIngredients } from '../_utils/api';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    setIsClient(true);
    getAllRecipes();
  }, []);

  const getAllRecipes = async () => {
    try {
      const data = await fetchAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
    }
  };

  const handleLoginClick = () => {
    router.push('/'); // Navigate to the login page
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRecipe(null);
    getAllRecipes(); // Refetch recipes to get the latest data
  };

  const handleItemSelect = async (recipe) => {
    console.log('Selected recipe:', recipe);
    const ingredientsData = await fetch(`/api/recipes/${recipe.id}`, {
      method: "GET",
    });
    const ingredients = await ingredientsData.json();
    console.log(ingredients);
    setIngredients(ingredients);
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    console.log('Deleting recipe:', selectedRecipe);
    if (selectedRecipe) {
      try {
        // Delete ingredients first
        await fetch(`/api/ingredients?recipeId=${selectedRecipe.id}`, {
          method: "DELETE",
        });

        // Delete recipe
        await fetch(`/api/recipes/${selectedRecipe.id}`, {
          method: 'DELETE',
        });

        // Refetch recipes to get the latest data
        getAllRecipes();
        setIsEditModalOpen(false);
        location.reload(true);
      } catch (error) {
        console.error('Failed to delete recipe', error);
      }
    }
  };

  const handleUpdate = async (updatedRecipe) => {
    try {
      await fetch(`/api/recipes/${updatedRecipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      //check recipe ingredients
      await updateIngredients(updatedRecipe.id, updatedRecipe.ingredients);

      setRecipes(recipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)));
      setIsEditModalOpen(false);
      location.reload(true);
    } catch (error) {
      console.error('Failed to update recipe', error);
    }

    getAllRecipes(); // Refetch recipes to get the latest data
  };

  const handleInsert = async (newRecipe) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });
      const createdRecipe = await response.json();
      console.log('Created Recipe:', createdRecipe);
      setRecipes((prevRecipes) => [...prevRecipes, createdRecipe]);

      getAllRecipes(); // Refetch recipes to get the latest data
      setIsModalOpen(false);
      location.reload(true);
    } catch (error) {
      console.error('Failed to add recipe', error);
    }
  };

  if (!isClient) {
    return null; // Render nothing while waiting for client-side hydration
  }

  return (
    <div className="bg-cover bg-center h-screen flex flex-col" style={{ backgroundImage: 'url(/background.jpg)' }}>
      <header className="bg-black bg-opacity-70 text-white p-4 flex justify-between items-center">
        {user ? (
          <div className="flex items-center">
            <p className="mr-4">Welcome, {user.email}</p>
            <button
              onClick={logout}
              className="bg-red-500 text-white border-none px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="mr-4">Welcome, Guest</p>
            <button
              onClick={handleLoginClick}
              className="bg-red-500 text-white border-none px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1 flex-col justify-center items-center space-y-4">
        <section className="bg-white bg-opacity-80 p-8 rounded w-full max-w-4xl text-center">
          <h1>Recipe Sharing Platform</h1>
          <RecipeList items={recipes} onItemSelect={handleItemSelect} ingredients={ingredients} />
        </section>
        <section className="w-full max-w-4xl">
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Recipe
          </button>
        </section>
        <Footer />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded relative w-1/2">
            <button
              onClick={handleCloseModal}
              className="bg-red-500 text-white px-4 py-2 rounded absolute top-2 right-2"
            >
              x
            </button>
            <RecipeForm
              onSubmit={handleInsert}
            />
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded relative w-1/2">
            <button
              onClick={handleCloseModal}
              className="bg-red-500 text-white px-4 py-2 rounded absolute top-2 right-2"
            >
              x
            </button>
            <RecipeForm
              initialData={selectedRecipe}
              onSubmit={handleUpdate}
            />
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
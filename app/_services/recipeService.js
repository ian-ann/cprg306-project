import { db } from "../_utils/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const recipeCollection = collection(db, "recipes");

export const createRecipe = async (recipe) => {
  await addDoc(recipeCollection, recipe);
};

export const getRecipes = async () => {
  const snapshot = await getDocs(recipeCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateRecipe = async (id, updatedRecipe) => {
  const recipeDoc = doc(db, "recipes", id);
  await updateDoc(recipeDoc, updatedRecipe);
};

export const deleteRecipe = async (id) => {
  const recipeDoc = doc(db, "recipes", id);
  await deleteDoc(recipeDoc);
};
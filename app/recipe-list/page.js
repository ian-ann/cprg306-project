"use client";

import RecipeForm from '../components/RecipeForm'
import RecipeList from '../components/RecipeList'

export default function Home() {
  return (
    <div>
      <h1>Recipe Sharing Platform</h1>
      <RecipeForm />
      <RecipeList />
    </div>
  )
}
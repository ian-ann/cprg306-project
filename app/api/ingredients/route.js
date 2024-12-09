import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const dbUrl = process.env.DATABASE_URL || "";
const sql = neon(dbUrl);

const IngredientSchema = z.object({
  recipeId: z.number().int(),
  ingredientName: z.string().max(50),
  measures: z.string().optional().default(''),
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Request body:', body); // Add logging to debug the request body

    // Parse the ingredient data
    const parsedIngredientData = IngredientSchema.parse(body);
    console.log('Parsed Ingredient Data:', parsedIngredientData);

    // Construct the SQL query to insert the ingredient data
    const insertIngredientQuery = `
      INSERT INTO ingredients ("recipeId", "ingredientName", "measures")
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const ingredientValues = [parsedIngredientData.recipeId, parsedIngredientData.ingredientName, parsedIngredientData.measures];

    console.log(insertIngredientQuery, ingredientValues); // Add logging to debug the request query

    // Execute the SQL query
    const ingredientResult = await sql(insertIngredientQuery, ingredientValues);
    console.log('SQL query result:', ingredientResult);

    return new Response(JSON.stringify(ingredientResult), { status: 201 });
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get('recipeId');
    if (!recipeId) {
      return NextResponse.json({ message: 'Missing recipeId parameter' }, { status: 400 });
    }
    const recipeIdNum = Number(recipeId);

    // Construct the SQL query to fetch the ingredients data
    const selectIngredientsQuery = `
      SELECT *
      FROM "ingredients"
      WHERE "recipeId" = $1;
    `;
    const values = [recipeId];

    console.log(selectIngredientsQuery, values); // Add logging to debug the request query

    // Execute the SQL query
    const result = await sql(selectIngredientsQuery, values);
    console.log('SQL query result:', result);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Ingredients not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get('recipeId');
    if (!recipeId) {
      return NextResponse.json({ message: 'Missing recipeId parameter' }, { status: 400 });
    }
    const recipeIdNum = Number(recipeId);

    if (!recipeIdNum) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    }
    const idNum = Number(recipeId);

    // Construct the SQL query to fetch the recipe data
    const selectRecipeQuery = `
      DELETE FROM ingredients
      WHERE "recipeId" = $1;
    `;
    const values = [idNum];

    console.log(selectRecipeQuery, values); // Add logging to debug the request query

    // Execute the SQL query
    const result = await sql(selectRecipeQuery, values);
    console.log('SQL query result:', result);

    return NextResponse.json(null, { status: 200 });

  } catch (error) {
    console.error('Error executing SQL query:', error);
    return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
  }
}
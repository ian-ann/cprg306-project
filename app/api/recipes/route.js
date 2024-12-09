// pages/api/recipes.js
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const dbUrl = process.env.DATABASE_URL || "";
const sql = neon(dbUrl);

const RecipeSchema = z.object({
    title: z.string().max(50),
    Category: z.string().max(50).optional().default(''),
    Instructions: z.string().optional().default(''),
    source: z.string().optional().default(''),
    image: z.string().optional().default(''),
    dateModified: z.string().optional().default(''),
    MealThumb: z.string().optional().default(''),
    YouTube: z.string().optional().default(''),
    description: z.string().optional().default(''),
});

const IngredientSchema = z.object({
    recipeId: z.number().int(),
    ingredientName: z.string().max(50),
    measures: z.string().optional().default(''),
});


export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Request body:', body); // Add logging to debug the request body

        // Parse the recipe data
        const { ingredients, ...recipeData } = body;
        const parsedRecipeData = RecipeSchema.parse(recipeData);
        console.log('Parsed Recipe Data:', parsedRecipeData);

        // Construct the SQL query to insert the recipe data
        const insertRecipeQuery = `
        INSERT INTO recipes ("title", "Category", "Instructions", "source", "image", "dateModified", "MealThumb", "YouTube", "description")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
      `;
        const recipeValues = [parsedRecipeData.title, parsedRecipeData.Category, parsedRecipeData.Instructions, parsedRecipeData.source, parsedRecipeData.image, parsedRecipeData.dateModified, parsedRecipeData.MealThumb, parsedRecipeData.YouTube, parsedRecipeData.description];

        console.log(insertRecipeQuery, recipeValues); // Add logging to debug the request query

        // Execute the SQL query
        const recipeResult = await sql(insertRecipeQuery, recipeValues);
        console.log('SQL query result:', recipeResult);

        // Check if the insertion was successful
        if (recipeResult.rowCount === 0) {
            throw new Error('Failed to insert recipe');
        }

        const recipeId = recipeResult[0].id;

        // Parse the ingredients data
        console.log('Ingredients:', ingredients);
        console.log('Recipe ID:', recipeId);
        const parsedIngredients = ingredients.map(ingredient => IngredientSchema.parse({ ...ingredient, recipeId }));
        console.log('Parsed Ingredients:', parsedIngredients);

        if (parsedIngredients.length > 0) {
            // Construct the SQL query to insert the ingredient data
            const insertIngredientQuery = `
        INSERT INTO ingredients ("recipeId", "ingredientName", "measures")
        VALUES ($1, $2, $3)
        RETURNING id;
      `;

            for (const ingredient of parsedIngredients) {
                const ingredientValues = [ingredient.recipeId, ingredient.ingredientName, ingredient.measures];
                console.log(insertIngredientQuery, ingredientValues); // Add logging to debug the request query

                // Execute the SQL query
                const ingredientResult = await sql(insertIngredientQuery, ingredientValues);
                console.log('SQL query result:', ingredientResult);

                // Check if the insertion was successful
                if (ingredientResult.rowCount === 0) {
                    throw new Error('Failed to insert ingredient');
                }
            }
        }

        return NextResponse.json(recipeResult, { status: 201 });
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const Category = url.searchParams.get('Category');
        console.log('Category:', Category); // Add logging to debug the Category

        // retrieve the list of recipe from the database
        const response = await sql`SELECT * FROM recipes order by id`;

        //for future update, search by ingredient & Category
        // if (Category != null) {

        //     let response = response.find((recipes) => recipes.Category === Category);
        //     if (!response) {
        //         return new Response("This recipe does not exist", { status: 404 });
        //     }
        // }

        return new Response(JSON.stringify(response), { status: 200 });

    } catch (error) {
        console.error('Error fetching recipes from database', error);
        return NextResponse.json({ message: 'Error fetching recipes from database' }, { status: 500 });
    }
}

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

export async function GET(request, { params }) {
    const { id } = await params;
    const idNum = Number(id);
    // retrieve the list of recipes from the database
    const response = await sql`SELECT * FROM recipes order by id`;

    return new Response(JSON.stringify(response), { status: 200 });
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const idNum = Number(id);
        const body = await request.json();
        console.log('Request body:', body); // Add logging to debug the request body

        // Parse the recipe data
        const { ingredients, ...recipeData } = body;
        const parsedRecipeData = RecipeSchema.parse(recipeData);
        console.log('Parsed Recipe Data:', parsedRecipeData);

        const { title, Category, Instructions, source, image, dateModified, MealThumb, YouTube, description } = parsedRecipeData;

        // Construct the SQL query to update the recipe data
        const updateRecipeQuery = `
        UPDATE recipes
        SET "title" = $1, "Category" = $2, "Instructions" = $3, "source" = $4, "image" = $5, "dateModified" = $6, "MealThumb" = $7, "YouTube" = $8, "description" = $9
        WHERE id = $10
        RETURNING id;
      `;
        const recipeValues = [title, Category, Instructions, source, image, dateModified, MealThumb, YouTube, description, idNum];

        console.log(updateRecipeQuery, recipeValues); // Add logging to debug the request query

        // Execute the SQL query
        const recipeResult = await sql(updateRecipeQuery, recipeValues);
        console.log('SQL query result:', recipeResult);

        // Check if the update was successful
        if (recipeResult.rowCount === 0) {
            throw new Error('Failed to update recipe');
        }

        return NextResponse.json(recipeResult, { status: 200 });
    } catch (error) {
        console.error('Error executing SQL query:', error);
        return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const { id } = await params;
    const idNum = Number(id);
    let recipes = await request.json();
    try {
        if (recipes.name) {
            // update the recipes name in the database for recipes number [idNum]
            await sql`UPDATE recipes SET name = ${recipes.name} WHERE id = ${idNum};`;
        }
        if (recipes.age) {
            // update the recipes age in the database for recipes number [idNum]
            await sql`UPDATE recipes SET age = ${recipes.age} WHERE id = ${idNum};`;
        }
    } catch (error) {
        return new Response("Database Error", { status: 503 })
    }
    return new Response(null, { status: 204 });
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    if (!id) {
        return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    }
    const idNum = Number(id);

    // check for authenticated user
    // delete recipes number [idNum] from database
    await sql`DELETE FROM recipes WHERE id = ${idNum}`;
    return new Response(null, { status: 204 });
}
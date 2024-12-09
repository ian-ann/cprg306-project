import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const dbUrl = process.env.DATABASE_URL || "";
const sql = neon(dbUrl);

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
    }
    const idNum = Number(id);

    // Construct the SQL query to fetch the recipe data
    const selectRecipeQuery = `
      SELECT *
      FROM ingredients
      WHERE id = $1;
    `;
    const values = [idNum];

    console.log(selectRecipeQuery, values); // Add logging to debug the request query

    // Execute the SQL query
    const result = await sql(selectRecipeQuery, values);
    console.log('SQL query result:', result);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    try {
      const { id } = await params;
      if (!id) {
        return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 });
      }
      const idNum = Number(id);
  
      // Construct the SQL query to fetch the recipe data
      const selectRecipeQuery = `
        DELETE FROM ingredients
        WHERE id = $1;
      `;
      const values = [idNum];
  
      console.log(selectRecipeQuery, values); // Add logging to debug the request query
  
      // Execute the SQL query
      const result = await sql(selectRecipeQuery, values);
      console.log('SQL query result:', result);
      return NextResponse.json({ message: 'Successfully deleted ingredients'}, { status: 200 });
  
    } catch (error) {
      console.error('Error executing SQL query:', error);
      return NextResponse.json({ message: 'Error executing SQL query', error: error.message }, { status: 500 });
    }
  }
  
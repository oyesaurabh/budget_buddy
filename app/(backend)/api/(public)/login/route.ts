import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const res = await sql`
      CREATE TABLE IF NOT EXISTS Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
      )
    `;
    console.log(res);
    return NextResponse.json({
      status: true,
      message: "Table created successfully",
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

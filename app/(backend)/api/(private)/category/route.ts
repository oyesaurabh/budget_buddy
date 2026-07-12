import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

async function getCategories(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account_id = searchParams.get("account_id") ?? "";

  //getting all the accounts data of user.
  let data;
  try {
    const categories = await prisma.categories.findMany({
      where: { account_id },
      select: { name: true, id: true, monthly_budget: true },
    });
    // Convert budget from paise to rupees for the client
    data = categories.map((c) => ({
      ...c,
      monthly_budget:
        c.monthly_budget != null ? c.monthly_budget / 100 : null,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching categories");
  }

  return NextResponse.json({
    status: true,
    message: "Successfull",
    data: data,
  });
}
const createCategory = async (request: NextRequest) => {
  const body = await request.json();
  const { account_id, name, monthly_budget } = body;

  // Store budget in paise; null when not provided
  const budgetInPaise =
    monthly_budget != null && monthly_budget !== ""
      ? Math.round(Number(monthly_budget) * 100)
      : null;

  //now simply save data into db
  let res;
  try {
    res = await prisma.categories.create({
      data: {
        name,
        account_id,
        monthly_budget: budgetInPaise,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while creating category");
  }

  return NextResponse.json(
    {
      status: true,
      message: "Category Created Successfully",
      data: {
        id: res.id,
        name: res.name,
        monthly_budget:
          res.monthly_budget != null ? res.monthly_budget / 100 : null,
      },
    },
    { status: 200 }
  );
};
const editCategory = async (request: NextRequest) => {
  const { name, id, monthly_budget } = await request.json();
  if (!!name == false || !!id == false)
    return NextResponse.json({
      status: false,
      message: "Invalid Body Params",
    });

  // Store budget in paise; null clears an existing budget
  const budgetInPaise =
    monthly_budget != null && monthly_budget !== ""
      ? Math.round(Number(monthly_budget) * 100)
      : null;

  //updating
  try {
    await prisma.categories.update({
      where: { id },
      data: { name, monthly_budget: budgetInPaise },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error while updating category");
  }

  return NextResponse.json({
    status: true,
    message: "successfully updated",
  });
};
export const GET = withErrorHandling(getCategories);
export const POST = withErrorHandling(createCategory);
export const PATCH = withErrorHandling(editCategory);

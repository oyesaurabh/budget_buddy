import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/utils";
import prisma from "@/lib/db";

async function getCategories(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account_id = searchParams.get("account_id") ?? "";

  //getting all the accounts data of user.
  let data;
  try {
    data = await prisma.categories.findMany({
      where: { account_id },
      select: { name: true, id: true },
    });
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
  const { account_id, name } = body;

  //now simply save data into db
  let res;
  try {
    res = await prisma.categories.create({
      data: {
        name,
        account_id,
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
      data: { id: res.id, name: res.name },
    },
    { status: 200 }
  );
};
const editCategory = async (request: NextRequest) => {
  const { name, id } = await request.json();
  if (!!name == false || !!id == false)
    return NextResponse.json({
      status: false,
      message: "Invalid Body Params",
    });

  //updating
  try {
    await prisma.categories.update({
      where: { id },
      data: { name },
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

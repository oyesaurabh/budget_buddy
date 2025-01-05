import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withErrorHandling } from "@/utils";
import { categorySchema } from "@/utils/schema";

async function getCategories(request: NextRequest) {
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);

  //getting all the accounts data of user.
  let data;
  try {
    data = await prisma.categories.findMany({
      where: { user_id: userId },
      select: { name: true, id: true },
    });
  } catch (error) {
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
  const { name } = categorySchema.parse(body);

  //taking our userid from req header
  const sessionHeader = request.headers.get("x-user-session");
  if (!sessionHeader) {
    throw new Error("Invalid session");
  }
  const { userId } = JSON.parse(sessionHeader);

  //now simply save data into db
  let res;
  try {
    res = await prisma.categories.create({
      data: {
        name,
        user_id: userId,
      },
    });
  } catch (error) {
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

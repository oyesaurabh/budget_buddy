import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { withErrorHandling } from "@/utils";

const bulkDelete = async (request: NextRequest) => {
  const ids = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { status: false, message: "No IDs provided for deletion." },
      { status: 400 }
    );
  }

  //lets delete from db
  let deleteResponse;
  try {
    deleteResponse = await prisma.accounts.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error("Error while deleting accounts", error);
    throw new Error("Error while deleting accounts");
  }

  return NextResponse.json(
    {
      status: true,
      message: `${deleteResponse.count} account(s) deleted successfully`,
    },
    { status: 200 }
  );
};
export const POST = withErrorHandling(bulkDelete);

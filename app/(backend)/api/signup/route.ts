import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

import {
  signupSchema,
  hashPassword,
  randomHash,
  withErrorHandling,
} from "@/utils";

const createUser = async (request: NextRequest) => {
  const body = await request.json();
  const { email, password, name } = signupSchema.parse(body);

  //checking if user already exists
  let userExist;
  try {
    userExist = await prisma.users.findFirst({
      where: {
        email: { equals: email },
      },
    });
    if (userExist)
      return NextResponse.json(
        {
          status: false,
          message: "User already exists",
        },
        { status: 404 }
      );
  } catch (error) {
    throw new Error("Error while fetching user");
  }

  //creating new user
  const salt = await randomHash();
  const hashedPassword = await hashPassword(salt, password);

  try {
    await prisma.users.create({
      data: {
        name,
        email,
        salt,
        password: hashedPassword,
      },
    });
  } catch (error) {
    throw new Error("Error while creating user");
  }

  return NextResponse.json(
    { status: true, message: "Successfully Created" },
    { status: 200 }
  );
};
export const POST = withErrorHandling(createUser);

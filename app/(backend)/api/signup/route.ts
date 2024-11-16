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
  const userExist = await prisma.users.findFirst({
    where: {
      email: { equals: email },
    },
  });
  if (userExist) throw new Error("User Already Exist");

  //creating new user
  const salt = await randomHash();
  const hashedPassword = await hashPassword(salt, password);

  await prisma.users.create({
    data: {
      name,
      email,
      salt,
      password: hashedPassword,
    },
  });

  return NextResponse.json(
    { status: true, message: "Successfully Created" },
    { status: 200 }
  );
};
export const POST = withErrorHandling(createUser);

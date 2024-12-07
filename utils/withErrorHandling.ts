// import {
//   PrismaClientInitializationError,
//   PrismaClientKnownRequestError,
//   PrismaClientRustPanicError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const withErrorHandling = (
  handler: (request: NextRequest) => Promise<NextResponse>
) => {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            status: false,
            message: error.issues[0]?.message,
          },
          { status: 400 }
        );
      }
      // if (
      //   error instanceof PrismaClientUnknownRequestError ||
      //   error instanceof PrismaClientKnownRequestError ||
      //   error instanceof PrismaClientInitializationError ||
      //   error instanceof PrismaClientRustPanicError ||
      //   error instanceof PrismaClientValidationError
      // ) {
      //   return NextResponse.json(
      //     {
      //       status: false,
      //       message: "Database Error",
      //     },
      //     { status: 500 }
      //   );
      // }

      return NextResponse.json(
        { status: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  };
};

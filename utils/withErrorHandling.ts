import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export const withErrorHandling = (
  handler: (request: NextRequest) => Promise<NextResponse>
) => {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            status: false,
            message: error.issues[0]?.message,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { status: false, message: error.message ?? "Internal server error" },
        { status: 500 }
      );
    }
  };
};

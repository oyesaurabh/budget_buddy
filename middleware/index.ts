import { NextRequest } from "next/server";
import { authMiddleware } from "./auth";
import { subscriptionMiddleware } from "./subscriber";

export const middleware = [
  {
    matcher: "^/api/auth",
    middleware: authMiddleware,
  },
  {
    matcher: "^/api/premium",
    middleware: async (request: NextRequest) => {
      const authResponse = await authMiddleware(request);
      if (authResponse.status !== 200) {
        return authResponse;
      }
      return await subscriptionMiddleware(request);
    },
  },
];

import { authMiddlewareAPI, authMiddlewareFrontend } from "./auth";

export const customMiddleware = [
  {
    matcher: "^/api/auth",
    middleware: authMiddlewareAPI,
  },
  {
    // matcher: "^(?!/api/).*",
    matcher: "^/app",
    middleware: authMiddlewareFrontend,
  },
];

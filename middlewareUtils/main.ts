import { authMiddlewareAPI, authMiddlewareFrontend } from "./auth";

export const customMiddleware = [
  {
    matcher: "^/api/auth",
    middleware: authMiddlewareAPI,
  },
  {
    matcher: "^/app",
    middleware: authMiddlewareFrontend,
  },
];

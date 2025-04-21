// mocks/handlers.ts
import { http } from "msw";

export const handlers = [
  http.post("/auth/v1/token", () => {
    return Response.json({ user: { id: "user-123" } });
  }),
  http.get("/rest/v1/profiles", () => {
    return Response.json([{ id: "user-123", role: null, onboarding_step: null }]);
  }),
];
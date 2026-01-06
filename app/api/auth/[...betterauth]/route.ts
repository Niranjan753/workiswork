import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST, PUT, DELETE, PATCH } = toNextJsHandler(auth);


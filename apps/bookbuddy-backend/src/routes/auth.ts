import { Router } from "express";
import { auth } from "../lib/auth";
import { toNodeHandler } from "better-auth/node";

const router = Router();

// Delegate all auth requests to Better Auth
router.all("*", toNodeHandler(auth));

export default router;

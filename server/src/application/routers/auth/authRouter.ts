import {
  handlePostRegister,
  handlePostSignIn,
  handlePostSignOut,
  handleGetUser,
} from "@/application/routers/auth/handlers";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", handlePostRegister);
authRouter.post("/signIn", handlePostSignIn);
authRouter.post("/signOut", handlePostSignOut);
authRouter.get("/user", handleGetUser);

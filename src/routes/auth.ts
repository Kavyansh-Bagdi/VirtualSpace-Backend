import express, { Request, Response } from "express";
import { genPassword, genToken, verifyPassword } from "../controllers/password";
import prisma from "../prisma";
const authRouter = express();

authRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    let userCreated = false;
    let userEmail = "";
    try {
      const signUpForm = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email: signUpForm.email },
      });
      if (existingUser) {
        res.status(409).json({ message: "User already exists" });
        return;
      }

      const hashedPassword = genPassword(signUpForm.password);

      const userData = await prisma.user.create({
        data: {
          name: signUpForm.name,
          email: signUpForm.email,
          hashedPassword,
        },
        select: {
          name: true,
          email: true,
        },
      });

      userCreated = true;
      userEmail = userData.email;

      const token = genToken(userData.name, userData.email);

      res.status(201).json({
        message: "Signup successful",
        user: userData,
        token,
      });
    } catch (error) {
      if (userCreated && userEmail) {
        try {
          await prisma.user.delete({ where: { email: userEmail } });
        } catch (deleteError) {}
      }
      res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }
);

authRouter.post(
  "/signin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const loginFormData = req.body;

      const userData = await prisma.user.findFirst({
        where: {
          email: loginFormData.email,
        },
        select: {
          name: true,
          email: true,
          hashedPassword: true,
        },
      });

      if (!userData) {
        res.status(401).json({ message: "Invalid Email or Password" });
        return;
      }

      if (!verifyPassword(userData.hashedPassword, loginFormData.password)) {
        res.status(401).json({ message: "Invalid Email or Password" });
        return;
      }

      const token = genToken(userData.name, userData.email);

      const { hashedPassword, ...safeUserData } = userData;

      res.status(200).json({
        message: "Signin successful",
        user: safeUserData,
        token,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  }
);

export default authRouter;

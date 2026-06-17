import { Router } from "express";
import { CreateUserSchema, SinginSchema } from "@repo/common/types";
import { prisma, secret } from "../config/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRoute = Router();

userRoute.post("/singup", async (req, res) => {
  try {
    const result = CreateUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: "false",
        message: "Incorrect inputs",
      });
    }
    const { name, username, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: username,
      },
      select: {
        name: true,
        username: true,
        password: true,
      },
    });
    if (!existingUser) {
      return res.status(409).json({
        success: true,
        message: "user already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await prisma.user.create({
      data: {
        email: username,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    const data = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(data, secret as string, { expiresIn: "30d" });

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

userRoute.post("/singin", async (req, res) => {
  try {
    const { email, password } = req.body();

    const validation = SinginSchema.safeParse({ email, password });
    if (!validation.success) {
      return res.status(401).json({
        success: false,
        message: "validation error",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        id: true,
        password: true,
        name: true,
      },
    });
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "user not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        succes: false,
        message: "password does not match",
      });
    }

    const data = { id: user.id, email: user.email, name: user.name };
    const token = await jwt.sign(data, secret as string);

    return res.status(200).json({
      succes:true,
      message:"user signed in  successfully",
      token,
      user:{
        id:user.id,
        name:user.name,
        email:user.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message :"sever error"
    })
  }
});

userRoute.post("/room", (req, res) => {});

export default userRoute;

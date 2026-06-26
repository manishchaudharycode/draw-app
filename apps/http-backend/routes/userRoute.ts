import { Router } from "express";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SinginSchema,
} from "@repo/common/types";
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";
import { AuthMiddleware } from "../middleware/authMiddleware";

const userRoute = Router();

const JWT_TOKEN = JWT_SECRET;

userRoute.post("/user/signup", async (req, res) => {
  try {
    const result = CreateUserSchema.safeParse(req.body);
    console.log(result.error);
    if (!result.success) {
      return res.status(400).json({
        success: "false",
        message: "Incorrect inputs",
      });
    }
    const { name, username, password, photo } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: username,
      },
      select: {
        name: true,
        password: true,
        photo: true,
      },
    });

    console.log(existingUser);
    if (existingUser) {
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
        photo: "",
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const data = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(data, JWT_TOKEN, {
      expiresIn: "30d",
    });

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

userRoute.post("/user/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const validation = SinginSchema.safeParse({ username, password });
    if (!validation.success) {
      return res.status(401).json({
        success: false,
        message: "validation error",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: username,
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
    const token = await jwt.sign(data, JWT_TOKEN as string);

    return res.status(200).json({
      succes: true,
      message: "user signed in  successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {}
});

userRoute.post("/room", AuthMiddleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect Inputs",
    });
  }
  /// @ts-ignore
  const userId = req.userId;

  try {
    const Room = await prisma.room.create({
      data: {
        slug: parsedData.data.name,
        admin: {
          connect: {
            id: req.userId,
          },
        },
      },
    });
    console.log(Room);
    return res.status(201).json({
      success: true,
      Room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

userRoute.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prisma.room.findMany({
    where: {
      id: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  res.status(200).json({
    messages,
  });
});

userRoute.get("/room/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("slug:", slug);

    const room = await prisma.room.findUnique({
      where: {
        slug: slug.trim(),
      },
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    console.log("room:", room);

    return res.json({
      id: room?.id || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
});

export default userRoute;

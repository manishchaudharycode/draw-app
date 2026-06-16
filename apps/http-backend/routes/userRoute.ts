import { Router } from "express";
import { CreateUserSchema } from "@repo/common/types";

const userRoute = Router();

userRoute.post("/singup", (res, req) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    return res.json({
      message: "incorrects inputs",
    });
  }
});

userRoute.post("/singin", (res, req) => {});

userRoute.post("/room", (req, res) => {});

export default userRoute;

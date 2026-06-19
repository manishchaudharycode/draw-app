import  { z } from "zod"

export const CreateUserSchema = z.object({
    username : z.string().min(3).max(20),
    name : z.string(),
    password: z.string().min(4).max(12),
    photo: z.string()
})

export const SinginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(4).max(12)
})


export const CreateRoomSchema = z.object({
    name : z.string().min(3).max(18)
})

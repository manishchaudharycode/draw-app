import type {Request, Response,  NextFunction } from "express"
import  jwt from "jsonwebtoken";
import { secret } from "../config/config";




export const AuthMiddleware = async (req:Request, res:Response, next:NextFunction)=>{
      const path = req.path;
      if(path.includes("/signin")|| path.includes("signup")){
        return next()
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({
            msg:"token required"
        })
      }
      
      const token = authHeader.split(" ")[1];
      if(!token){
        return res.status(401).json({
            msg:"token missing"
        })
      }
      try {
        const decoded = jwt.verify(token, secret as string) as any
        req.userId = decoded.id 
      } catch (error) {
        
      }
}
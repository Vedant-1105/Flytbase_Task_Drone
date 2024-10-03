import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError";



const verifyToken = async (req:Request , res:Response , next:NextFunction):Promise<any> => {
   try {
      const token:string = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
   
      if(!token){
         return res.status(401).json({message:"Unauthorized Request"});
      }
   
      const acessTokenSecret:string = process.env.ACCESS_TOKEN_SECRET || ""
      const decodedToken = jwt.verify(token , acessTokenSecret);
      const userId:ObjectId =  (decodedToken as JwtPayload)?._id;
      req.body.userId = userId;
      next();
   } catch (error) {
      console.log("Error While Verifing JWT TOKEN");
      console.log(error);
      return res.status(401).json(new ApiError(401 , "Somthing Went Wrong while Checking Tokens"))
   }
}


export {verifyToken}
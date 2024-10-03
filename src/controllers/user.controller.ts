import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import UserModel from "../models/User.model";
import { ObjectId } from "mongoose";
import { options } from "../constants";


export interface userData {
   username: string,
   email: string,
   password: string,
}
export interface tokens {
   accessToken: string,
   refreshToken: string
}
const generateAccessAndRefreshToken = async (userId: ObjectId): Promise<tokens> => {
   try {
      const user = await UserModel.findById(userId);
      if (!user) {
         console.log("user Not Found while creating tokens ");
         return { accessToken: "", refreshToken: "" };
      }
      const accessToken = await user?.generateAccessToken()
      const refreshToken = await user?.generateRefreshToken()

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }

   } catch (error) {
      console.log("Error While Creating Access And Refresh Tokens ");
      return { accessToken: "", refreshToken: "" };
   }
}


const signupUser = async (req: Request, res: Response) => {
   try {
      const { username, email, password }: userData = req.body;
      if (!username || !email || !password) {
         res.status(404).send(new ApiError(404, "All Fields Are Required For Registration"))
         return;
      }
      if (password.length < 4) {
         res.status(404).send(new ApiError(404, "Password Must Be At Least of 4 chars"))
         return;
      }

      if ([email, password, username].some((field) => field?.trim() == "")) {
         res.status(404).send(new ApiError(404, "Empty Fields Are not allowed"));
         return;
      }

      const isRegistered = await UserModel.findOne({
         $or: [
            { username },
            { email }
         ]
      })

      if (isRegistered) {
         res.status(409).json(new ApiError(409, "User Already Registered | Login to Access Your Account"))
      }

      const newUser = await UserModel.create({ username, email, password });

      const createdUser = await UserModel.findById(newUser._id).select("-password")

      if (!createdUser) {
         res.status(500).send(new ApiError(404, "Failed to Create User"))
      }
      res.status(201).send(new ApiResponse(201, createdUser, "User Created Successfully", true))
   } catch (error) {
      console.log("Error While Creating new User : ", error);
      // throw new ApiError(500 , "Error While Creating new User")
   }
}


const loginUser = async (req: Request, res: Response) => {
   try {
      const { username, email, password }: userData = req.body;
      if (!username || !email || !password) {
         res.status(404).send(new ApiError(404, "All Fields Are Required For"))
      }
      if (!username && !email) {
         res.status(404).send(new ApiError(404, "Either Username or Email is Required"));
      }

      const user = await UserModel.findOne({
         $or: [
            { username },
            { email }
         ]
      })

      if (!user) {
         res.status(404).send(new ApiError(404, "User Not found Please Signup First"))
         return;
      }

      const isPasscorrect = await user?.isPasswordCorrect(password)
      if (!isPasscorrect) {
         res.status(401).send(new ApiError(401, "Invalid Password"))
      }

      const { accessToken, refreshToken }: tokens = await generateAccessAndRefreshToken(user._id as ObjectId);

      const loggedInUser = await UserModel.findById(user._id).select("-password -refreshToken ");


      res.status(201)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
         .json(
            new ApiResponse(201, { user: loggedInUser, accessToken, refreshToken }, "User Logged In ", true)
         );

   } catch (error) {
      console.log("Error While Trying To Login User : ");
      console.log(error);
   }
}


const getCurrentUserDetails = async (req: Request, res: Response):Promise<any> => {
   try {
      const userId: ObjectId = req.body.userId as ObjectId;
      if(!userId){
         res.status(404).send(new ApiError(404, "User ID Not found in request"))
      }

      const user = await UserModel.findById(userId)
         .populate('drones')
         .populate('missions').select("-password -refreshToken");

      if (!user) {
         return res.status(404).json(new ApiError(404, "User Not Found please Login again"));
      }
      return res.status(200).json(new ApiResponse(200, {user}, "User Details Fetched Successfull" , true))
   } catch (error) {
      console.log("Error While Getting Current Users Info");
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
   }
};




export { signupUser, loginUser , getCurrentUserDetails}
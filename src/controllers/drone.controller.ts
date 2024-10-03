import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose, { ObjectId, Types } from "mongoose";
import { options } from "../constants";
import DroneModel from "../models/Drone.model";


export interface dronDocument{
   name: string,
   drone_type: string,
   make_name: string,
   userId: mongoose.Types.ObjectId,
   isBusy:boolean
}

const addDrone = async (req:Request , res:Response):Promise<any> => {
   try {
      const {name , drone_type , make_name , userId , isBusy}:dronDocument = req.body;
      if(!name || !drone_type || !make_name || !userId ){
         return res.status(402).json(new ApiError(402 , "Please fill Compalsary fields"))
      }

      const isDroneregistered = await DroneModel.findOne({name})
      if(isDroneregistered){
         return res.status(402).json(new ApiError(402 , "Drone With This name is already registered" , false ));
      }

      const newDrone =await DroneModel.create({
         name,
         make_name,
         drone_type,
         createdBy:userId
      })

      if(!newDrone){
         return res.status(402).json(new ApiError(402 , "Failed to add drone"))
      }

      return res.status(201).json(new ApiResponse(201 , newDrone , "Drone Added Succesfully",true))

   } catch (error) {
      console.log("Error while creating new Drone ");
      console.log(error);
      return res.status(402).json(new ApiError(402 , "Somthing Went Wrong While Adding New Drone ..."))
   }
}

const deleteDrone = async (req: Request, res: Response): Promise<void> => {
   try {
      const { droneId } = req.body as { droneId: string };
      
      if (!droneId) {
         res.status(400).json(new ApiError(400, "Drone Id Can't Be Empty"));
         return;
      }

      if (!Types.ObjectId.isValid(droneId)) {
         res.status(400).json(new ApiError(400, "Invalid Drone Id format"));
         return;
      }

      const deletedDrone = await DroneModel.findOneAndDelete({_id:droneId});
      
      if (!deletedDrone) {
         res.status(404).json(new ApiError(404, "Drone not found or already deleted"));
         return;
      }

      res.status(200).json(new ApiResponse(200, null, "Drone Deleted Successfully", true));
   } catch (error) {
      console.error("Error While Deleting Drone:", error);
      res.status(500).json(new ApiError(500, "Internal Server Error While Deleting Drone"));
   }
}





export {addDrone  , deleteDrone}

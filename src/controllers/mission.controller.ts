import { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose, { ObjectId } from "mongoose";
import MisssionModel from "../models/Mission.model";

interface Waypoint {
    alt: number;
    lat: number;
    lng: number;
}
enum MissionCategory {
    path = 'path',
    survey = 'survey',
    corridor = 'corridor'
}

export interface Mission {
    name:string,
    initial_speed:Number,
    initial_alt:Number,
    wayPoints:Waypoint[],
    drone:mongoose.Types.ObjectId,
    category: MissionCategory,
    userId:mongoose.Types.ObjectId
}

const addMission = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, initial_alt, initial_speed, wayPoints, drone, category ,userId}: Mission = req.body;

        // Basic field validation
        if (!name || !wayPoints || !drone || !category) {
            res.status(400).json(new ApiError(400, "All fields are required", false));
            return;
        }

        // Validate category
        if (!Object.values(MissionCategory).includes(category)) {
            res.status(400).json(new ApiError(400, "Invalid mission category", false));
            return;
        }

        if (!Array.isArray(wayPoints) || wayPoints.length === 0) {
            res.status(400).json(new ApiError(400, "Waypoints must be a non-empty array", false));
            return;
        }

        const isValidWaypoint = (wp: Waypoint): boolean => 
            typeof wp.alt === 'number' && 
            typeof wp.lat === 'number' && 
            typeof wp.lng === 'number' &&
            wp.lat >= -90 && wp.lat <= 90 &&
            wp.lng >= -180 && wp.lng <= 180;

        if (!wayPoints.every(isValidWaypoint)) {
            res.status(400).json(new ApiError(400, "Invalid waypoint data", false));
            return;
        }

        const alreadyExists = await MisssionModel.findOne({ name });
        if (alreadyExists) {
            res.status(400).json(new ApiError(400, "Mission with same name already exists", false));
            return;
        }

        // Create new mission
        const newMission = await MisssionModel.create({
            name,
            initial_alt,
            initial_speed,
            wayPoints,
            drone,
            category,
            createdby:userId
        });

        if(!newMission){
            res.status(500).json(new ApiError(500, "Failed to create mission", false));
        }

        res.status(201).json(new ApiResponse(201,newMission , "Mission Created Succesfully ",true));

    } catch (error) {
        console.error("Error while adding new mission:", error);
        res.status(500).json(new ApiError(500, "Something went wrong while creating mission"));
    }
};




export { addMission }
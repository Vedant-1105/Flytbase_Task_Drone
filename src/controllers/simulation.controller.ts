import { Request , Response , NextFunction } from "express";
import FlightLogs  from "../models/simulation.model";
import MisssionModel , {Mission , Waypoint } from "../models/Mission.model";
import DroneModel , {Drone} from "../models/Drone.model";
import { ApiError } from "../utils/ApiError";
import mongoose, { Document, ObjectId, trusted } from "mongoose";
import ApiResponse from "../utils/ApiResponse";



export let stopFlag = {}
let visitedWayPoints:Array<Waypoint> = []
const flightId = `flight-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


export interface getIds{
    mission_id:mongoose.Schema.Types.ObjectId,
    drone_id:mongoose.Schema.Types.ObjectId,
    userId:mongoose.Schema.Types.ObjectId
}
export interface Flight{
    drone_id:mongoose.Schema.Types.ObjectId,
    mission_name:string,
    waypoints:Waypoint[],
    speed:number,
    mission_start:number,
    mission_end:number,
    distance:number,
    flightId:string,
}

export interface missionWay{
    lat1:number,
    lon1:number,
    lat2:number,
    lon2:number,
}





export interface getLogs{
    userId: mongoose.Schema.Types.ObjectId,
    flightId:mongoose.Schema.Types.ObjectId
}





function haversineDistance({lat1, lon1, lat2, lon2}:missionWay) {
    const R = 6371e3; 
    const φ1 = lat1 * (Math.PI / 180); 
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
}

async function simulateFlight(missionDoc:Mission, dronDoc:Drone) {
    console.log("Started Simulation Flight....")
    let currentIndex = 0;
    let startTime = Date.now();
    let endTime = null; // Timestamp for when the mission starts
    const waypoints = missionDoc.wayPoints;
    const speed = missionDoc.initial_speed;
    let totalDistance:number = 0;
    const droneId = dronDoc._id;
    
    // console.log(`Initial Speed : ${speed} \nInitial WayPoints : ${JSON.stringify(waypoints , null , 2)}`)

    async function moveToNextWaypoint() {
        if (currentIndex >= waypoints.length - 1) {
            console.log("Mission complete!");
            endTime= Date.now() / 1000
            const docToReturn:Flight = {
                drone_id:dronDoc._id as ObjectId,
                mission_name:missionDoc.name,
                waypoints:visitedWayPoints,
                speed:speed as number,
                distance:totalDistance,
                mission_start:0,    
                mission_end:endTime,
                flightId            
            }
            console.log("=================Flight Log Data ===============");
            console.log(JSON.stringify(docToReturn , null , 2));
            if(docToReturn){
                const isSaved = await saveFlightLog(docToReturn);
            }
            return docToReturn;
        }

        const currentWaypoint = waypoints[currentIndex];
        const nextWaypoint = waypoints[currentIndex + 1];

        // Calculate distance and time
        const distance = haversineDistance(
            {lat1:currentWaypoint.lat,lon1:currentWaypoint.lng,
            lat2:nextWaypoint.lat, lon2:nextWaypoint.lng}
        );
        totalDistance += distance;
        const travelTime = timeToTravel(distance, speed as number); // Time in seconds
        const logData = {
            timeToReach: travelTime, // Time taken to reach this waypoint
            distance: distance // Distance to the next waypoint
        };
        console.log(`Time to reach waypoint ${currentIndex + 1}: ${logData.timeToReach} seconds, Distance: ${logData.distance} meters`);
        setTimeout(() => {
            currentIndex++;
            logWaypointData(nextWaypoint, startTime);
            moveToNextWaypoint(); // Move to the next waypoint recursively
        }, travelTime * 1000); // Set delay based on travel time
    }

    return moveToNextWaypoint();
}

function timeToTravel(distance:number, speed:number):number {
    return distance / speed; // Time in seconds
}

function logWaypointData(waypoint:Waypoint, startTime:number) {
    const timeSinceStart = Math.floor((Date.now() - startTime) / 1000);
    const data = {
        time: timeSinceStart,
        alt: waypoint.alt,
        lat: waypoint.lat,
        lng: waypoint.lng
    };
    visitedWayPoints.push(data);
    

    console.log("Waypoint data: \n", data);
}

async function saveFlightLog(flightData:Flight):Promise<boolean> {
    if(!flightData){
        return false;
    }
    const flightLog = JSON.stringify(flightData);
    console.log(flightLog);
    const save =await FlightLogs.create(flightData)

    if(save){
        console.log("Flight log saved");
        return true
    }
    return false
}






const StartSimulation = async (req:Request , res:Response , next:NextFunction):Promise<any> =>{
    try {
        const {mission_id , drone_id , userId}:getIds = req.body
        if(!mission_id || !drone_id){
            return res.status(400).json(new ApiError(400 , "Mission Or Drone Not Found"))
        }
        const mission =await MisssionModel.findById({_id:mission_id});
        const drone =await DroneModel.findById({_id:drone_id});
        if(!mission || !drone){
            return res.status(400).json(new ApiError(400 , "Mission Or Drone Not Registered "))
        }
        const resp =await simulateFlight(mission , drone);
        console.log(resp)
        return res.status(200).json(new ApiResponse(200 , flightId, "Mission Started..."));
    } catch (error) {
        console.log("Error While Starting Simulation");
        console.log(error);
        return res.status(400).json(new ApiError(400 , "Something Went Wrong While Starting Simulation"));
    }
}


const getFlightLogs = async (req:Request , res:Response , next:NextFunction):Promise<any> =>{
    try {
        const {flightId , userId}:getLogs = req.body;
        if(!flightId || !userId){
            return res.status(400).json(new ApiError(400 , "Flight Id Or User Id Not Found In Request"))
        }

        const flight =await FlightLogs.findOne({flightId});
        if(!flight){
            res.status(401).json(new ApiError(401,"Flight With Given Id Doesnt Exists"))
        }

        return res.status(201).json(new ApiResponse(201 , flight , "Flight Report Found"))
    } catch (error) {
        console.log("Error Occured During getting Flight Logs")
        console.log(error);
        return res.status(401).json(new ApiError(401 , "Somthing Went Wrong While getting FlightLogs"))
    }
}


export {StartSimulation , getFlightLogs}
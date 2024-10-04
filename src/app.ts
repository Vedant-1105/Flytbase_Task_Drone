import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true , limit:'16kb'}))
app.use(cookieParser())

app.use((err:ApiError, req:express.Request, res:express.Response, next:express.NextFunction) => {
    res.status(err.statusCode || 500).json({
        success: err.success,
        data: err.data,
        message: err.message,  // Ensure message is included here
        errors: err.errors || [],
    });
});



//User Routes
import userRouter from './routes/user.routes';
app.use('/api/v1/user',userRouter)


//Drone Routes 
import droneRouter from './routes/drone.routes'
app.use('/api/v1/drone',droneRouter);


//Mission Routes
import missionRouter from './routes/mission.routes'
app.use('/api/v1/mission',missionRouter)



//Simulation Routes 
import simulationRouter from './routes/simulation.routes'

app.use('/api/v1/simulation',simulationRouter)

export {app}
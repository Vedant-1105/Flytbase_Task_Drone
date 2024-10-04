import { Router } from "express";
import { getFlightLogs, StartSimulation } from "../controllers/simulation.controller";
import { verifyToken } from "../middleware/auth.middlewar";


const router = Router()



//All Secured Routes 
router.route('/start').post(verifyToken , StartSimulation);
router.route('/get').get(verifyToken , getFlightLogs);




export default router;

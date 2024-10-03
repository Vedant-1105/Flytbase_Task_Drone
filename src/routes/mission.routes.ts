import { Router } from "express";
import { verifyToken } from "../middleware/auth.middlewar";
import { addMission, deleteMission } from "../controllers/mission.controller";


const router = Router();


// All Protected Routes
router.route('/add').post(verifyToken , addMission)
router.route('/delete').delete(verifyToken , deleteMission)




export default router
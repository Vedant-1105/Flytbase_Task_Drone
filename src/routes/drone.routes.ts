import { Router } from "express";
import { verifyToken } from "../middleware/auth.middlewar";
import { addDrone, deleteDrone } from "../controllers/drone.controller";


const router = Router();


//All Secured Routes
router.route('/addDrone').post(verifyToken , addDrone);
router.route('/delete').delete(verifyToken , deleteDrone);

export default router;
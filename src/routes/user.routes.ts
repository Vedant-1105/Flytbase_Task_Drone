import { Router } from "express";
import { getCurrentUserDetails, loginUser, signupUser } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middlewar";





const router = Router()


router.route('/register').post(signupUser)
router.route('/login').post(loginUser)


//Protected Routes
router.route('/getUserDetails').get( verifyToken , getCurrentUserDetails);


export default router;
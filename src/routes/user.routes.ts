import { Router } from "express";
import { deleteUser, getCurrentUserDetails, loginUser, signupUser } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middlewar";





const router = Router()


router.route('/register').post(signupUser)
router.route('/login').post(loginUser)


//Protected Routes
router.route('/delete').delete(verifyToken , deleteUser);
router.route('/getUserDetails').get( verifyToken , getCurrentUserDetails);


export default router;
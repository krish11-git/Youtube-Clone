import { Router } from "express";
import { changeCurrentPassword, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), registerUser);

router.route("/login").post(upload.none(),loginUser);

router.route("/logout").post(verifyJwt,logoutUser)

router.route("/refresh-token").post(upload.none(),refreshAccessToken)

export default router;
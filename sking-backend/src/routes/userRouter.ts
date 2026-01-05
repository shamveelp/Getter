import { Router } from "express";
import userAuthRoutes from "./userRoutes/userAuth.routes";
import userProfileRoutes from "./userRoutes/userProfile.routes";

const userRouter = Router();

userRouter.use("/auth", userAuthRoutes);
userRouter.use("/profile", userProfileRoutes);

export default userRouter;

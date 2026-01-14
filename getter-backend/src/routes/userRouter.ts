import { Router } from "express";
import userAuthRoutes from "./userRoutes/userAuth.routes";
import userProfileRoutes from "./userRoutes/userProfile.routes";
import bookingRouter from "./userRoutes/userBooking.routes";
import exploreRouter from "./userRoutes/userExplore.routes";

const userRouter = Router();

userRouter.use("/auth", userAuthRoutes);
userRouter.use("/profile", userProfileRoutes);
userRouter.use("/bookings", bookingRouter);
userRouter.use("/", exploreRouter); // e.g. /api/user/services, /api/user/events

export default userRouter;

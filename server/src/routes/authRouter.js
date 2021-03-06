import Router from "express";
import { addUserValidation } from "../middleware/validationMiddleware.js";

import {
  authController,
  // verifyController,
} from "../controllers/authController.js";

const authRouter = new Router();
authRouter.post("/login", addUserValidation, authController);
// authRouter.get("/verify", verifyController);
// authRouter.get("/users", getAllUsersController);

export default authRouter;

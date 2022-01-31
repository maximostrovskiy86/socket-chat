import jwt from "jsonwebtoken";
import { login, getAllUsers, updateUser } from "../services/authService.js";

// eslint-disable-next-line consistent-return
export const authController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const data = await login(username, password);

    if (!data) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Already exist",
      });
    }

    res.json({
      status: "success",
      ...data,
    });
  } catch (e) {
    res.status(400).json({ message: "Login error" });
  }
};

export const verifyController = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Username or password is wrong --authorization",
    });
  }

  const [bearer, token] = req.headers.authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Username or password is wrong --bearer",
    });
  }

  if (token === null) {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Unauthorized token",
    });
  }

  try {
    const user = jwt.decode(token, process.env.JWT_SECRET);
    req.user = user;
    res.json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Please, provide a token",
    });
  }
};

export const getAllUsersController = async (usersOnline) => {
  try {
    const users = await getAllUsers();
    return users.map((user) => ({
      ...user.toObject(),
      isOnline: usersOnline.some((u) => u.id === user.id),
    }));
  } catch (e) {
    // res.status(400).json({ message: "Login error" });
    throw e;
  }
};

export const changeUserById = async (id, data) => {
  try {
    const user = await updateUser({ _id: id }, { ...data });

    return user;
  } catch (e) {
    console.log("changeUserById:", e.message);
  }
};

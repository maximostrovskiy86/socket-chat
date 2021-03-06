import jwt from "jsonwebtoken";

// eslint-disable-next-line consistent-return
export const authMiddleware = (req, res, next) => {
  // console.log("authorization: ", req.headers.authorization);

  const [bearer, token] = req.headers.authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Username or password is wrong",
    });
  }

  if (!token) {
    return res.status(401).json({
      status: "401 Unauthorized",
      code: 401,
      message: "Please, provide a token",
    });
  }

  try {
    const user = jwt.decode(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

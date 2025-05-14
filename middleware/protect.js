import HTTPStatus from "../enum/HTTPStatus.js";
import User from "../model/User.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "Unautherized: No Token Provided" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "Unautherized: Invalid Token" });
    }

    const user = await User.findById(decode.id);

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Server Error" });
  }
};

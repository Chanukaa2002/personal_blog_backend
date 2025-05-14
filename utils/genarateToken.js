import jwt from "jsonwebtoken";

export const genarateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id:userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, //cookie cannot be accessed by client side
    sameSite: "strict", //cookie cannot be accessed by cross site
    secure: process.env.NODE_ENV !== "development",
  });
};
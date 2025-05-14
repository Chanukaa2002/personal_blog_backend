import bcrypt from "bcryptjs";
import User from "../model/User.model.js";
import HTTPStatus from "../enum/HTTPStatus.js";
import { genarateTokenAndSetCookie } from "../utils/genarateToken.js";
export const createUser = async (req, res) => {
  try {
    const { username, name, password, github_username } = req.body;

    if (!username || !name || !password || !github_username) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "Pelase provide all the details to save a auther!" });
    }

    const existsUsername = await User.findOne({ username });
    const existsGithub = await User.findOne({ github_username });

    if (existsGithub) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: "Github usrname has been already have in the system",
      });
    }
    if (existsUsername) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "Usrname has been already have in the system" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      github_username,
    });

    if (!user) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "User creation was failed" });
    }

    res
      .status(HTTPStatus.CREATED)
      .json({ message: "User created successfully!", user: user });
  } catch (error) {
    console.log(`Error in createUser method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "Pelase provide all the details!" });
    }

    const existedUser = await User.findOne({ username });

    if (!existedUser) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "UserName or Password was wrong!" });
    }

    genarateTokenAndSetCookie(existedUser._id, res);

    res.status(HTTPStatus.OK).json({ message: "Login success" });
  } catch (error) {
    console.log(`Error in loginUser method => ${error}`);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findOne(req.user._id).select("-password");

    if (!user) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ message: "Please log into the system" });
    }
    res.status(HTTPStatus.OK).json(user);
  } catch (error) {
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    console.log(`Error in auth.controller.me => ${error}`);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(HTTPStatus.OK).json({ message: "Logout successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Server Error" });
  }
};


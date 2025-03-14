import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";

dotenv.config();

export const updateUser = async (req, res, next) => {
  if(req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    if(req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }  

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set:{
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }
    }, {new: true});

    const {password, ...rest} = updatedUser._doc;
    res.status(200).json(rest);

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if(req.user.id !== req.params.id)
    return next(errorHandler(401, "Unauthorized"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
}
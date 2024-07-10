import bcrypt from "bcrypt";
import { createHmac } from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";
import { _errors } from "../errors/error.js";
import userModel from "../models/userModel.js";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_USER } from "../secure/roles.js";
import { errorResponse, successResponse } from "../utils/response.js";

const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ email: username });

    if (!user) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }

    const hmac = createHmac("sha256", process.env.SECRETKEY);
    hmac.update(password);
    const hash = hmac.digest("hex");
    if (hash !== user.password) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }
    if (user.roles.includes(ROLE_ADMIN) || user.roles.includes(ROLE_MANAGER)) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }

    jwt.sign(
      { userId: user._id, roles: user.roles, phone: user.phone },
      process.env.SECRETKEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          res.status(500).json(errorResponse(500, err.message, err.message));
        } else {
          res.json(
            successResponse({
              access_token: token,
              expires_in: 7 * 24 * 3600,
              type: "bearer",
            })
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, error.message));
  }
};
const LoginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.findOne({ email: username });

    if (!user) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }

    const hmac = createHmac("sha256", process.env.SECRETKEY);
    hmac.update(password);
    const hash = hmac.digest("hex");
    if (hash !== user.password) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }
    if (
      !user.roles.includes(ROLE_ADMIN) ||
      !user.roles.includes(ROLE_MANAGER)
    ) {
      return res
        .status(400)
        .json(errorResponse(400, _errors.E001_001, _errors.E001_001));
    }

    jwt.sign(
      { userId: user._id, roles: user.roles, phone: user.phone },
      process.env.SECRETKEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          res.status(500).json(errorResponse(500, err.message, err.message));
        } else {
          res.json(
            successResponse({
              access_token: token,
              expires_in: 7 * 24 * 3600,
              type: "bearer",
            })
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, error.message));
  }
};

//register user
const RegisterUser = async (req, res) => {
  const { name, email, phone, password, roles, restaurantId, address } =
    req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      const response = errorResponse(400, _errors.E001_002, null);
      return res.status(400).json(response);
    }
    const newUser = new userModel({ ...req.body, roles: [ROLE_USER] });
    await newUser.save();
    jwt.sign(
      { userId: newUser._id, roles: newUser.roles, phone: newUser.phone },
      process.env.SECRETKEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          res.status(500).json(errorResponse(500, err.message, err.message));
        } else {
          res.status(201).json(
            successResponse({
              access_token: token,
              expires_in: 7 * 24 * 3600,
              type: "bearer",
            })
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, error.message));
  }
};

export { Login, LoginAdmin, loginUser, RegisterUser };

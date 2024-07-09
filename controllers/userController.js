import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { _errors } from "../errors/error.js";
import userModel from "../models/userModel.js";
import { ROLE_ADMIN, ROLE_MANAGER } from "../secure/roles.js";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
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
//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
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
    const newUser = new userModel(req.body);
    await newUser.save();
    jwt.sign(
      { userId: user._id, roles: user.roles, phone: user.phone },
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
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { Login, LoginAdmin, loginUser, RegisterUser };

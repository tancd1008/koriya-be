import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

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
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { Login, loginUser, registerUser };

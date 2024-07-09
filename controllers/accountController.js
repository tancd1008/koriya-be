import { _errors } from "../errors/error.js";
import userModel from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

const CreateNewAccount = async (req, res) => {
  const { name, email, phone, password } = req.body;

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
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(500, error.message, error.message);
    res.status(500).json(response);
  }
};

export { CreateNewAccount };

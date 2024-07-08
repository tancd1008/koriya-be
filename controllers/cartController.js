import { _errors } from "../errors/error.js";
import userModel from "../models/userModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

// add to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.body.userId });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(400).json(response);
  }
};

// remove food from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(400).json(response);
  }
};

// get user cart
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData: cartData });
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(400).json(response);
  }
};

export { addToCart, getCart, removeFromCart };

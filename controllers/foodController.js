import fs from "fs";
import foodModel from "../models/foodModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    const response = successResponse(foods);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(400).json(response);
  }
};

// add food
const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(201).json(response);
  }
};

// delete food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(400).json(response);
  }
};

export { addFood, listFood, removeFood };

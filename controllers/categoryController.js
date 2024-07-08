// all category list

import categoryModel from "../models/categoryModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

const listCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    const response = successResponse(categories);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(201).json(response);
  }
};
const addCategory = async (req, res) => {
  try {
    const category = new categoryModel({
      name: req.body.name,
      description: req.body.description,
      status: true,
    });

    await category.save();
    const response = successResponse(null);
    res.status(201).json(response);
  } catch (error) {
    const response = errorResponse(400, error.message, null);
    res.status(201).json(response);
  }
};

export { addCategory, listCategory };

import fs from "fs";
import foodModel from "../models/foodModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

const AdminGetAllFoods = async (req, res) => {
  try {
    let {
      page = 1,
      size = 10,
      status,
      createdAt,
      updatedAt,
      name,
      sort,
      category,
    } = req.body;

    // Sử dụng giá trị của người dùng nếu có
    if (req.body.page !== undefined) {
      page = parseInt(req.body.page);
    }
    if (req.body.size !== undefined) {
      size = parseInt(req.body.size);
    }

    const filter = {};

    if (status !== undefined) {
      filter.status = parseInt(status);
    }
    if (category !== undefined) {
      filter.category = category;
    }

    if (name !== undefined) {
      filter.name = { $regex: name, $options: "i" };
    }

    const skip = (page - 1) * size;

    let query = foodModel.find(filter).skip(skip).limit(size);
    if (sort !== undefined && sort.nameField) {
      const sortOrder = sort.order === "asc" ? 1 : -1;
      const sortObject = {};
      sortObject[sort.nameField] = sortOrder;
      query = query.sort(sortObject);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const count = await foodModel.countDocuments(filter);

    const Foods = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);

    const response = successPaginationResponse(
      Foods,
      recordCount,
      page,
      size,
      pageCount
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

// add food
const AddNewFood = async (req, res) => {
  const { name, category } = req.body;
  let image = `${req.file.filename}`;
  try {
    const existingFood = await FindFoodByName(name, category);
    if (existingFood) {
      return res
        .status(400)
        .json(errorResponse(400, "Food already exists", null));
    }
    const newFood = await foodModel.create({ ...req.body, image: image });
    res.status(201).json(successResponse(newFood._id));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
const FindFoodByName = async (name, category) => {
  try {
    const Food = await foodModel.findOne({ name, category });
    return Food;
  } catch (error) {
    throw new Error(
      `Error finding Food by name and category: ${error.message}`
    );
  }
};
const AdminGetFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await foodModel.findById(id).exec();
    if (!food) {
      return res.status(404).json(errorResponse(404, "Food not found", null));
    }
    res.status(200).json(successResponse(food));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
const UpdateFood = async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  let image = `${req.file.filename}`;
  try {
    const existingFood = await FindFoodByName(name, category);
    if (existingFood && existingFood._id.toString() !== id) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Another Food with the same name already exists",
            null
          )
        );
    }

    const updatedFood = await foodModel.findByIdAndUpdate(
      id,
      { ...req.body, image: image },
      {
        new: true,
      }
    );

    if (!updatedFood) {
      return res.status(404).json(errorResponse(404, "Food not found", null));
    }
    res.status(200).json(successResponse(updatedFood._id));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

const DeleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    const inactiveFood = await foodModel.findByIdAndUpdate(
      id,
      { status: process.env.DELETE },
      { new: true }
    );
    if (!inactiveFood) {
      return res.status(404).json(errorResponse(404, "Food not found", null));
    }
    res.status(200).json(successResponse("Food inactive successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

const UserGetAllFoodsByCategoryId = async (req, res) => {
  try {
    let { page = 1, size = 10, sort, category } = req.body;

    if (req.body.page !== undefined) {
      page = parseInt(req.body.page);
    }
    if (req.body.size !== undefined) {
      size = parseInt(req.body.size);
    }

    const filter = {};

    filter.status = process.env.ACTIVE;
    if (category !== undefined) {
      filter.category = category;
    }

    const skip = (page - 1) * size;

    let query = foodModel.find(filter).skip(skip).limit(size);

    if (sort !== undefined && sort.nameField) {
      const sortOrder = sort.order === "asc" ? 1 : -1;
      const sortObject = {};
      sortObject[sort.nameField] = sortOrder;
      query = query.sort(sortObject);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const count = await foodModel.countDocuments(filter);

    const Foods = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);

    const response = successPaginationResponse(
      Foods,
      recordCount,
      page,
      size,
      pageCount
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
const UserGetAllFood = async (req, res) => {
  try {
    let { page = 1, size = 10, name, sort, category } = req.body;

    if (req.body.page !== undefined) {
      page = parseInt(req.body.page);
    }
    if (req.body.size !== undefined) {
      size = parseInt(req.body.size);
    }

    const filter = {};

    filter.status = process.env.ACTIVE;
    if (category !== undefined) {
      filter.category = category;
    }

    if (name !== undefined) {
      filter.name = { $regex: name, $options: "i" };
    }

    const skip = (page - 1) * size;

    let query = foodModel.find(filter).skip(skip).limit(size);

    if (sort !== undefined && sort.nameField) {
      const sortOrder = sort.order === "asc" ? 1 : -1;
      const sortObject = {};
      sortObject[sort.nameField] = sortOrder;
      query = query.sort(sortObject);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const count = await foodModel.countDocuments(filter);

    const Foods = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);

    const response = successPaginationResponse(
      Foods,
      recordCount,
      page,
      size,
      pageCount
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
const UserGetFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await foodModel.findById(id).exec();
    if (!food || food?.status !== process.env.ACTIVE) {
      return res.status(404).json(errorResponse(404, "Food not found", null));
    }
    res.status(200).json(successResponse(food));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

export {
  AddNewFood,
  AdminGetAllFoods,
  AdminGetFoodById,
  DeleteFood,
  UpdateFood,
  UserGetAllFood,
  UserGetAllFoodsByCategoryId,
  UserGetFoodById,
};

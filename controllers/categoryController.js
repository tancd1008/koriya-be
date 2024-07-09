// all category list

import categoryModel from "../models/categoryModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

const AdminGetAllCategories = async (req, res) => {
  try {
    let { page = 1, size = 10, status, name, sort } = req.body;

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

    if (name !== undefined) {
      filter.name = { $regex: name, $options: "i" };
    }

    const skip = (page - 1) * size;

    let query = categoryModel.find(filter).skip(skip).limit(size);

    if (sort !== undefined && sort.nameField) {
      const sortOrder = sort.order === "asc" ? 1 : -1;
      const sortObject = {};
      sortObject[sort.nameField] = sortOrder;
      query = query.sort(sortObject);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const count = await categoryModel.countDocuments(filter);

    const Categories = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);

    const response = successPaginationResponse(
      Categories,
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

// add Category
const AddNewCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCategory = await findCategoryByName(name);
    if (existingCategory) {
      return res
        .status(400)
        .json(errorResponse(400, "Category already exists", null));
    }
    const newCategory = await categoryModel.create(req.body);
    res.status(201).json(successResponse(newCategory._id));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
const FindCategoryByName = async (name) => {
  try {
    const Category = await categoryModel.findOne({ name });
    return Category;
  } catch (error) {
    throw new Error(`Error finding Category by name: ${error.message}`);
  }
};
const AdminGetCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const Category = await categoryModel.findById(id).exec();
    if (!Category) {
      return res
        .status(404)
        .json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse(Category));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
const UpdateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const existingCategory = await FindCategoryByName(name);
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Another Category with the same name already exists",
            null
          )
        );
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse(updatedCategory._id));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const inactiveCategory = await categoryModel.findByIdAndUpdate(
      id,
      { status: process.env.DELETE },
      { new: true }
    );
    if (!inactiveCategory) {
      return res
        .status(404)
        .json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse("Category inactive successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

const UserGetAllCategory = async (req, res) => {
  try {
    let { page = 1, size = 10, name, sort } = req.body;

    if (req.body.page !== undefined) {
      page = parseInt(req.body.page);
    }
    if (req.body.size !== undefined) {
      size = parseInt(req.body.size);
    }

    const filter = {};

    filter.status = process.env.ACTIVE;

    if (name !== undefined) {
      filter.name = { $regex: name, $options: "i" };
    }

    const skip = (page - 1) * size;

    let query = categoryModel.find(filter).skip(skip).limit(size);

    if (sort !== undefined && sort.nameField) {
      const sortOrder = sort.order === "asc" ? 1 : -1;
      const sortObject = {};
      sortObject[sort.nameField] = sortOrder;
      query = query.sort(sortObject);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const count = await categoryModel.countDocuments(filter);

    const Categories = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);

    const response = successPaginationResponse(
      Categories,
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
const UserGetCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const Category = await categoryModel.findById(id).exec();
    if (!Category || Category?.status !== process.env.ACTIVE) {
      return res
        .status(404)
        .json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse(Category));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

export {
  AddNewCategory,
  AdminGetAllCategories,
  AdminGetCategoryById,
  DeleteCategory,
  UpdateCategory,
  UserGetAllCategory,
  UserGetCategoryById,
};

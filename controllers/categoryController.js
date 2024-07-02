import categoryModel from "../models/categoryModel.js";

// all category list
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.json({ success: true, data: categories })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add category
const addCategory = async (req, res) => {

    try {

        const category = new categoryModel({
            name: req.body.name,
            description: req.body.description,
            status: true
        })

        await category.save();
        res.json({ success: true, message: "Category Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete category
const removeCategory = async (req, res) => {
    try {

        const category = await categoryModel.findById(req.body.id);
        await categoryModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Category Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

export { listCategory, addCategory, removeCategory }

// all category list

import categoryModel from "../models/categoryModel.js"

const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.json({ success: false, data: categories })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}
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

export { listCategory, addCategory }
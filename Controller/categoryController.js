const Category = require('../models/categoryModel')

// to add category
exports.addCategory = async(req, res) => {
    // check if category already exists
    let categoryExists = await Category.findOne({category_name:req.body.category_name})

    // if category already exists, return error message
    if(categoryExists){
        return res.status(400).json({error:"Category already exist"})
    }

    // if category not exists, add category and send response
    let category = await Category.create({
        category_name : req.body.category_name
    })
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)
}

// to get all categories
exports.getAllCategories = async(req, res) => {
    let categories = await Category.find()
    if(!categories){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(categories)
}

// to get category details
exports.getCategoryDetails = async(req, res) => {
    let categories = await Category.findById(req.params.id)
    if(!categories){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(categories)
}

// to update category
exports.updateCategory = async(req, res) => {
    let categories = await Category.findByIdAndUpdate(req.params.id,{
        category_name:req.body.category_name
    },{new:true})
    if(!categories){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(categories)
}
// to delete category
exports.deleteCategory = async(req, res) => {
    let category = await Category.findByIdAndDelete(req.params.id)
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send({message:"Category deleted successfully"})
}
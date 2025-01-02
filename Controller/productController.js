const Product = require('../models/productModel')

// to add product
exports.addProduct = async(req, res) => {
    if(!req.file){
        return res.status(400).json({error:"Product image is required"})
    }
    let product = await Product.create({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category,
       image:req.file?.path,
        rating:req.body.rating,
        count_in_stock:req.body.count_in_stock
    })
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(product)
}

// to get all products
exports.getAllProducts = async(req, res) => {
    let product = await Product.find().populate('category','category_name')
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(product)
}
// to get product details
exports.getProductDetails = async(req, res) => {
    let product  = await Product.findById(req.params.id).populate('category', 'category_name')
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(product)
}
// to update product
exports.updateProduct = async(req, res) => {
    let product = await Product.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        rating:req.body.rating,
        category:req.body.category,
        image:req.file.path,
        count_in_stock:req.body.count_in_stock
    },{new:true})
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(product)
}
// to delete product
exports.deleteProduct = async(req, res) => {
    let product = await Product.findByIdAndDelete(req.params.id)
    if(!product){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(product)
}
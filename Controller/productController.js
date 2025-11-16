const Product = require("../models/productModel");

// to add product
exports.addProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Product image is required" });
  }
  let product = await Product.create({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.file?.path,
    rating: req.body.rating,
    count_in_stock: req.body.count_in_stock,
  });
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(product);
};

// to get all products
exports.getAllProducts = async (req, res) => {
  let product = await Product.find().populate("category", "category_name");
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(product);
};
// to get product details
exports.getProductDetails = async (req, res) => {
  let product = await Product.findById(req.params.id).populate(
    "category",
    "category_name"
  );
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(product);
};
// to update product
exports.updateProduct = async (req, res) => {
  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      rating: req.body.rating,
      category: req.body.category,
      image: req.file?.filename,
      count_in_stock: req.body.count_in_stock,
    },
    { new: true }
  );
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(product);
};
// to delete product
exports.deleteProduct = async (req, res) => {
  let product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(product);
};

// to get filtered products
exports.getFilteredProduct = async (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "title";
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.query.limit ? req.query.limit : 100000;

  let filterArgs = {};
  for (var key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "category") {
        filterArgs[key] = req.body.filters[key];
      } else {
        filterArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      }
    }
  }
  let products = await Product.find(filterArgs)
    .populate("category", "category_name")
    .sort([[sortBy, order]])
    .limit(limit);
  if (!products) {
    return res.status(400).json({ error: "Somethine went wrong" });
  }
  res.send(products);
};

// to get related products
exports.getRelatedProducts = async (req, res) => {
  let product = await Product.findById(req.params.id);
  let products = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  });
  if (!products) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(products);
};

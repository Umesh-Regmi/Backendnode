const express = require("express");
const { route } = require("./categoryRoute");
const {
  addProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getFilteredProduct,
  getRelatedProducts,
} = require("../Controller/productController");
const upload = require("../utils/fileUpload");
const { productCheck, validate } = require("../Validation/validation");
const router = express.Router();

router.post(
  "/addproduct",
  upload.single("product_image"),
  productCheck,
  validate,
  addProduct
);
router.get("/getallproducts", getAllProducts);
router.get("/getproductdetails/:id", getProductDetails);
router.put("/updateproduct/:id", upload.single("product_image"), updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.post("/getfilteredproduct", getFilteredProduct);
router.get("/getrelatedproducts/:id", getRelatedProducts);
module.exports = router;

const express = require('express')
const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../Controller/categoryController')
const upload = require('../utils/fileUpload')
const { requireSignin } = require('../Controller/userController')
const { categoryCheck, validate } = require('../Validation/validation')
const router = express.Router()

router.post('/addcategory',requireSignin,categoryCheck,validate, addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)

module.exports = router
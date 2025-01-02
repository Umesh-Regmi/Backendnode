const{check, validationResult}  = require('express-validator')

exports.categoryCheck = [
    check('category_name', 'category name is required').notEmpty()
    .isLength({min:3}).withMessage('Category name must be at least three characters')
    .matches(/^[a-zA-Z]+$/).withMessage('Category name must be only characters')
]

exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()[0].msg})
        }
        next()
    }

exports.productCheck = [
    check('title', 'prduct name is required').notEmpty()
    .isLength({min:3}).withMessage('Product name at least three characters'),
    check('price', 'product price is required').notEmpty()
    .isNumeric().withMessage('Product price must be a number'),
    check('description', 'description is required').notEmpty()
    .isLength({min:20}).withMessage('Description must be at least 20 characters'),
    check('count_in_stock', 'count_in_stock is required')
    .isNumeric().withMessage('Count in stock must be a number'),
    check('category', 'category is required')    
]

exports.userCheck = [
    check('username', "Username is required").notEmpty()
    .isLength({min:3}).withMessage("Username must have at least 3 characters"),
    check('email', 'Email is required').notEmpty()
    .isEmail().withMessage("Email incorrect format"),
    check('password', 'Password is required').notEmpty()
    .matches(/[a-z]/).withMessage('Password must consist of at least 1 lowercase character')
    .matches(/[A-Z]/).withMessage('Password must consist of at least 1 uppercase character')
    .matches(/[0-9]/).withMessage('Password must consist of at least 1 number')
    .matches(/[+\-@#!$%^&*]/).withMessage('Password must consist of at least 1 special character')
    .isLength({min:8}).withMessage('Password must be at least 8 characters')
]

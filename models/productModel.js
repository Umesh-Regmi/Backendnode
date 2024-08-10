const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:1
    },
    image:{
        type:String
    },
    category:{
        type:ObjectId,
        reference:"Category"
    }
}, {timestamps:true})
module.exports = mongoose.model("Product", productSchema)
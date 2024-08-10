// const http = require('http')
// const os = require('os')

// http.createServer(function(request, response){
//     response.writeHead(200, {'Content-Type':'text/plain'})
//     response.end('Hello Friends\n')
// }).listen(8081);

// console.log('Server running at http://127.0.0.1:8081/');

// console.log(os.homedir())
// console.log(os.type())
// console.log(os.hostname())

// importing packages
const express = require('express')
require('dotenv').config()
require('./database/connection')

// creating server
const app = express()
const port = process.env.PORT || 8000
app.use(express.json())

// function/ endpoint
// app.get('/hello', (request, response)=>{
//     response.send("Hello Programming language")
// })

// routes
const testRoute = require('./routes/test')
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')

// adding to the pipeline
app.use(testRoute)
app.use(categoryRoute)
app.use(productRoute)
// starting server
app.listen(port, () =>{
    console.log("App started successfully at port " +port)
})

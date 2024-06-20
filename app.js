
const express=require('express');
const cookieParser = require('cookie-parser');
// var server = require("./server");
require('dotenv').config();
var app=express();
const socket_io = require("socket.io");
const io = socket_io();
app.io = io;
const bodyParser=require('body-parser');
const cors=require('cors');
// app.use(cors({origin:'http://localhost:4200'}));
app.use(cors({origin:[process.env.CORS_FRONT,'http://127.0.0.1:8000']}))
app.use(bodyParser.json());
const routes = require('./route')

// const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://nyainamitantsoa1:w74du1b6ijbmI2QB@projectbs.wmabkvh.mongodb.net/?retryWrites=true&w=majority");
// mongoose.connect(process.env.DB_STRING_LOCAL);

// const User = require('./models/userModels');

// console.log(webpush.generateVAPIDKeys()); // new
// const webpush = require('web-push');

const vapidKeys = { // new
  publicKey: '<YOUR_PUBLIC_KEY>', // new
  privateKey: '<YOUR_PRIVATE_KEY>' // new
}; // 



app.use("/",routes(io));////ATO NY ROUTE REHETRA

//Manomboka eto 
// const cors = require('cors');



app.use(cors({
    credentials:true,
    origin:['http://localhost:8000','http://localhost:3000','http://127.0.0.1:8000','https://destination-nosybe.com','https://back-nosybe.aiolia.us']
}));
app.use(cookieParser());
   


app.listen(8088,()=>console.log('the serverr is running'));////PORT 

// console.log(process.env.HOST)
// server.start();

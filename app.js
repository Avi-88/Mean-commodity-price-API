const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const reportsRoutes = require('./routes/reports');
require('dotenv').config();

const app = express();


dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(
    console.log("connected to database")
);

app.use(express.json());
app.use('/' , reportsRoutes);

app.listen(3001 , ()=>{
    console.log("server is up and running");
});
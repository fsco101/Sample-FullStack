const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')

const products = require('./routes/products');


app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/api/v1', products);






module.exports = app
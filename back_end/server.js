const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { readdirSync } = require('fs');
const connectDB = require('./config/Database');

const app = express();


// Static file
app.use(express.static('public'));

// connect database
connectDB();

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// Auto Route
readdirSync('./routes')
    .map( r => app.use("/api", require('./routes/' + r)));

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Server is Running on port ${port}`));
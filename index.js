const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => {
        console.log('connected to db');
    }
);

// import middlewares
app.use(express.json());

//route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => { console.log("listening to port 3000")});
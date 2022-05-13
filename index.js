const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

//Create express server
const app = express();

//Connect DB
dbConnection();

//Public directory middleware
app.use(express.static('public'));

//Use cors
app.use(cors())

//Read and body parse
app.use(express.json());

//Routes
//Auth route // create, login, renew users
app.use('/api/auth', require('./routes/auth'));



// CRUD: Events calendar

//listen requests
app.listen(process.env.PORT, () => {
    console.log(`Server en puerto ${process.env.PORT}`);
});
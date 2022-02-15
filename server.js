const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
require('dotenv').config();
let resMsg = require('./messages.json');

const itemRoute = require('./route/item.route');
const authRoute = require('./route/auth.route');
const cartRoute = require('./route/cart.route');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/item', itemRoute);
app.use('/api/auth', authRoute);
app.use('/api/cart', cartRoute);

app.listen(process.env.PORT || 8000, ()=>{
    console.log(resMsg.SERVER_RUNNING_MESSAGE, process.env.PORT);
});


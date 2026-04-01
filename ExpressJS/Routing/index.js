const express = require('express');
const app = express();
const port = 3000;
const item = require('./item');

app.use('/api',item);

app.listen(port,()=>{
    console.log(`server is listening on port : ${port}`)
})
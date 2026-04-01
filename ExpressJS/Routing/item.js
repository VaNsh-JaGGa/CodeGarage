const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Got a Get Request");
    // res.sendFile('./dummy.html')
    // {root:__dirname}
})

router.post('/items', (req, res) => {
    res.send("Got a POST request");
})

router.put('/items/:id', (req, res) => {
    res.send("Got a Put Request")
})

router.delete('/items/:id', (req, res) => {
    res.send("Got a Delete Request")
})

module.exports=router
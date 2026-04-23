const express = require('express');
const router = express.Router();
const {login,signup,logout} = require('../controllers/authController')
const {protect} = require('../middleware/Authmiddleware')

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',protect,logout);

module.exports=router;
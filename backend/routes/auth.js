const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    registerUser,
    loginUser,
    forgotPassword,
} = require('../controllers/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
// router.put('/password/reset/:token', resetPassword);


module.exports = router;
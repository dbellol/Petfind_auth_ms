const express=require('express');
const {createUser,loginUserCtrl}=require('../controller/userController');
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
module.exports = router

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
module.exports=router;
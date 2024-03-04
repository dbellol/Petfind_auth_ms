const express=require('express');
const {createUser,loginUserCtrl, loginAdmin, loginFoundation}=require('../controller/userController');
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
module.exports = router

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/foundation-login", loginFoundation);

module.exports=router;
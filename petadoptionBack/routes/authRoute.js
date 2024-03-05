const express=require('express');
const {createUser,loginUserCtrl, loginAdmin, loginFoundation, updatedaUser, forgotPasswordToken, resetPassword, updatePassword, getaUser, getsUser}=require('../controller/userController');
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
module.exports = router

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/foundation-login", loginFoundation);
router.put("/edit-user", authMiddleware, updatedaUser);

router.get("/all-users", getaUser);
router.get("/:id", authMiddleware, getsUser);

module.exports=router;
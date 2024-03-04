const User = require("../models/userModel");
const { generateToken } = require("../config/jwtWebToken");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      //Crear un nuevo usuario
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      throw new Error("El usuario que desea crear ya existe");
    }
  });
  const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Verificar si un usuario existe o no
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        wishlist: findUser?.wishlist,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Contraseña o usuario invalido");
    }
  });
  module.exports={
    loginUserCtrl, createUser
  };
  
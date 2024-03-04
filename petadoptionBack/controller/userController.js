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
  /*Admin login*/
  const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Verificar si un usuario existe o no
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("No está autorizado");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
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
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        address: findAdmin?.address,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Contraseña o usuario invalido");
    }
  });
  /*Admin foundation*/
  const loginFoundation = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Verificar si un usuario existe o no
    const findFoundation = await User.findOne({ email });
    if (findFoundation.role !== "foundation") throw new Error("No está autorizado");
    if (findFoundation && (await findFoundation.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findFoundation?._id);
      const updateuser = await User.findByIdAndUpdate(
        findFoundation.id,
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
        _id: findFoundation?._id,
        firstname: findFoundation?.firstname,
        lastname: findFoundation?.lastname,
        email: findFoundation?.email,
        mobile: findFoundation?.mobile,
        address: findFoundation?.address,
        token: generateToken(findFoundation?._id),
      });
    } else {
      throw new Error("Contraseña o usuario invalido");
    }
  });
  module.exports={
    loginUserCtrl, createUser, loginAdmin, loginFoundation
  };
  
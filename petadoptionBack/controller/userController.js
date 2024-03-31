const User = require("../models/userModel");
const { generateToken } = require("../config/jwtWebToken");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailController");
const {cloudinaryUploadImg} = require("../utils/cloudinary");
const fs = require('fs');

const crypto = require('crypto');

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
    const findAdmin = await User.findOne({ email });

    if (!findAdmin) {
        throw new Error("El usuario no existe");
    }

    if (findAdmin.role !== "admin") {
        throw new Error("No está autorizado");
    }

    if (await findAdmin.isPasswordMatched(password)) {
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
        throw new Error("Contraseña o usuario inválido");
    }
});

const loginFoundation = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findFoundation = await User.findOne({ email });

    if (!findFoundation) {
        throw new Error("El usuario no existe");
    }

    if (findFoundation.role !== "foundation") {
        throw new Error("No está autorizado");
    }

    if (await findFoundation.isPasswordMatched(password)) {
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
        throw new Error("Contraseña o usuario inválido");
    }
});

  //Actualizar un usuario
    const updatedaUser = asyncHandler(async (req, res) => {
        const { id } = req.user;
        validateMongoId(id);
        try {
        const updatedaUser = await User.findByIdAndUpdate(
            id,
            {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            address: req?.body?.address,
            },
            {
            new: true,
            }
        );
        res.json(updatedaUser);
        } catch (error) {
        throw new Error(error);
        }
    });
  /*Actualizar contraseña*/
    const updatePassword = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { password } = req.body;
        validateMongoId(_id);
        const user = await User.findById(_id);
        if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
        } else {
        res.json(user);
        }
    });
  /*Olvidaste tu constraseña? correo*/
    const forgotPasswordToken = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("Usuario con este email no encontrado");
        try {
        const token = await user.createPasswordResetToken();
        await user.save();
        /*Ojo aquí para cuando lo subamos redirigirlos a la url de la subida*/
        const resetURL = `Hola, sigue este link para reiniciar tu contraseña. Este link expirará en 10 minutos, contando desde ahora. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click aqui</>`;
        const data = {
            to: email,
            subject: "Olvidaste tu constraseña link",
            text: "Hola usuario",
            html: resetURL,
        };
        sendEmail(data);
        res.json(token);
        } catch (error) {
        throw new Error(error);
        }
    });
    /*Reset contraseña en el correo*/
    const resetPassword = asyncHandler(async (req, res) => {
        const { password } = req.body;
        const { token } = req.params;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
        });
        if (!user)
        throw new Error("El token expiro. Por favor intenta de nuevo más tarde");
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json(user);
    });
    //Ver todos los usuarios
    const getaUser = asyncHandler(async (req, res) => {
        try {
        const getUsers = await User.find();
        res.json(getUsers);
        } catch (error) {
        throw new Error(error);
        }
    });
    //Ver un solo  usuario
    const getsUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoId(id);
        try {
        const getsUser = await User.findById(id);
        res.json({
            getsUser,
        });
        } catch (error) {
        throw new Error(error);
        }
    });
/*Calificar*/
const rating = asyncHandler(async(req,res)=>{
  const{_id} = req.user;
  const{star, userId, comment}=req.body;
  try{
      /*Producto con comentarios*/
      const user = await User.findById(userId);
      let alreadyRated = user.ratings.find((userId)=>userId.postedby.toString()===_id.toString());
      if(alreadyRated){
          const updateRating  = await User.updateOne({
              ratings:{
                  $elemMatch: alreadyRated
              }},{
                  $set:{
                      "ratings.$.star":star, "ratings.$.comment":comment
                  },
              },{
                  new:true,
              }
          );
      }else{
          /*Producto con puntuaciones*/
          const rateUser = await User.findByIdAndUpdate(userId,{
              $push:{
                  ratings:{
                      star:star,
                      comment:comment,
                      postedby: _id,
                  },
              },
          },{
              new:true,
          }
          );
      }
      /*Tener todas las puntuaciones del producto*/
      const getAllRatings = await User.findById(userId);
      let totalRating = getAllRatings.ratings.length;
      let ratingSum = getAllRatings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0);
      let actualRaiting = Math.round(ratingSum/totalRating);
      let finalUser = await User.findByIdAndUpdate(userId,{
      totalrating: actualRaiting,
      }, 
      {new:true,}
      );
      res.json(finalUser);
  }catch (error){
      throw new Error(error);
  }
});
  //Borrar un usuario
  const deletesUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoId(id);

    try {
      const deletesUser = await User.findByIdAndDelete(id);
      res.json({
        deletesUser,
      });
    } catch (error) {
      throw new Error(error);
    }
  });
/*Borrar todos los usuarios*/
  const deleteallUser = asyncHandler(async(req,res)=>{
    try{
        const getUsers = await User.delete();
        res.json(deleteallUser);
    }catch (error){
        throw new Error(error);
    }
});
//Bloquear usuario
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});
//Desbloquear usuario
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Usuario desbloqueado",
    });
  } catch (error) {
    throw new Error(error);
  }
});
 /*Cargar imagenes*/
const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images"); // Obtener los archivos de la solicitud
    const urls = [];
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No files uploaded.");
    }
    for (const file of files) {
      const { path } = file;
      const { url, public_id } = await uploader(path);
      urls.push({ url, public_id });
      /*fs.unlinkSync(path);*/
    }
    // Actualizar la base de datos con las URLs de las imágenes
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { image: { $each: urls } }, // Use $each to push multiple items into the array
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});



  module.exports={
    loginUserCtrl, createUser, loginAdmin, loginFoundation, updatedaUser, 
    forgotPasswordToken, resetPassword, updatePassword, getaUser, getsUser, 
    rating, deletesUser, deleteallUser, blockUser, unblockUser, uploadImages
  };
  
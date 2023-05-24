const express = require('express');
const { register, login } = require('../controllers/authController');
const { body, check } = require("express-validator");
const { validarCampos } = require('../validators/validateField');


const router = express.Router()

router.post("/register",[
  body("username")
    .notEmpty()
    .withMessage("Debe incluir el Username"),
  body("fullname")
    .notEmpty()
    .withMessage("Debe incluir la el nombre completo"),
  body("email")
    .isEmail()
    .withMessage("Debe incluir el email / email no válido"),
  body("password")
    .notEmpty()
    .withMessage("Debe incluir una contraseña"),
  body("rol")
    .notEmpty()
    .withMessage("Debe definir el rol")
], validarCampos, register );

router.post("/login",
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
validarCampos, login );



module.exports = router;
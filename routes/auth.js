const express = require('express');
const { register, login } = require('../controllers/authController');
const { body } = require("express-validator");
const { validarCampos } = require('../validators/validateField');


const router = express.Router()

//Ruta para el registro de un usuario (Profesor o Estudiante)
router.post("/register",[
  body("username")
    .notEmpty().withMessage("Debe incluir el Username"),
  body("fullname")
    .notEmpty().withMessage("Debe incluir la el nombre completo"),
  body("email")
    .isEmail().withMessage("Debe incluir el email / email no válido"),
  body("password")
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[a-zA-Z]/).withMessage('La contraseña debe contener al menos una letra'),
  body("rol")
    .notEmpty().withMessage("Debe definir el rol")
], validarCampos, register );

// Ruta para el proceso de login de un usuario (Adminstrador, Profesor o Estudiante)
router.post("/login",[
  body("email")
    .notEmpty().withMessage('El correo es requerido'),
  body("password")
    .notEmpty().withMessage('La contraseña es requerida')
], validarCampos, login );



module.exports = router;
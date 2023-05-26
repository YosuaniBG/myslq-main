const express = require("express");
const {
  OneAdmin,
  AllUsersByRole,
  newAdmin,
  updateAdminData,
  switchStatus,
  managePassword,
  admissionTeacher,
} = require("../controllers/adminController");
const { body } = require("express-validator");
const { validarCampos } = require("../validators/validateField");

const router = express.Router();

/*---------------------- Rutas para Administrador -------------------------------------------------*/

// Ruta para Obtener información de un administrador específico:
router.get("/admins/:id", OneAdmin);

// Ruta para Obtener todos los administradores:
router.get("/admins", AllUsersByRole("administrador"));

// Ruta para Obtener todos los profesores:
router.get("/teachers", AllUsersByRole("profesor"));

// Ruta para Obtener todos los estudiantes:
router.get("/students", AllUsersByRole("alumno"));

// Ruta para Agregar un nuevo administrador:
router.post(
  "/admins",
  [
    body("username").notEmpty().withMessage("Debe incluir el Username"),
    body("fullname")
      .notEmpty()
      .withMessage("Debe incluir la el nombre completo"),
    body("email")
      .isEmail()
      .withMessage("Debe incluir el email / email no válido"),
    body("password")
      .notEmpty()
      .withMessage("La contraseña es requerida")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres")
      .matches(/\d/)
      .withMessage("La contraseña debe contener al menos un número")
      .matches(/[a-zA-Z]/)
      .withMessage("La contraseña debe contener al menos una letra"),
  ],
  validarCampos,
  newAdmin
);

// Ruta para Actualizar informacion de un administrador específico:
router.put(
  "/admins/:id",
  [
    body("username").notEmpty().withMessage("Debe incluir el Username"),
    body("fullname")
      .notEmpty()
      .withMessage("Debe incluir la el nombre completo"),
    body("email")
      .isEmail()
      .withMessage("Debe incluir el email / email no válido"),
  ],
  validarCampos,
  updateAdminData
);

// Ruta para gestionar Contraseña
router.patch(
  "/change_password",
  [
    body("password")
      .notEmpty()
      .withMessage("La contraseña es requerida")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres")
      .matches(/\d/)
      .withMessage("La contraseña debe contener al menos un número")
      .matches(/[a-zA-Z]/)
      .withMessage("La contraseña debe contener al menos una letra"),
  ],
  validarCampos,
  managePassword
);

// Ruta para Actualizar el STATUS de un administrador específico:
router.patch("/admins/:id", switchStatus("administrador"));

// Ruta para Actualizar el STATUS de un profesor específico:
router.patch("/teachers/:id", switchStatus("profesor"));

// Ruta para Actualizar el STATUS de un estudiante específico:
router.patch("/students/:id", switchStatus("alumno"));

// Ruta para ACTIVAR un profesor nuevo que solicita formar parte de la plataforma
router.patch("/teachers/:id/admission", admissionTeacher);

module.exports = router;

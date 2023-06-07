const express = require("express");
const {
  OneAdmin,
  AllUsersByRole,
  newAdmin,
  updateAdminData,
  switchStatus,
  managePassword,
  admissionTeacher,
  adminDashboard,
} = require("../controllers/adminController");
const { body } = require("express-validator");
const { validarCampos } = require("../validators/validateField");

const router = express.Router();

/*---------------------- Rutas para Administrador -------------------------------------------------*/

// Ruta que Devuelve un objeto con los datos del estudiantes y ademas una lista de sus profesores
router.get("/dashboard", adminDashboard); 

// Ruta para Obtener información de un administrador específico:
router.get("/dashboard/admins/:id", OneAdmin);

// Ruta para Obtener todos los administradores:
router.get("/dashboard/admins", AllUsersByRole("administrador"));

// Ruta para Obtener todos los profesores:
router.get("/dashboard/teachers", AllUsersByRole("profesor"));

// Ruta para Obtener todos los estudiantes:
router.get("/dashboard/students", AllUsersByRole("alumno"));

// Ruta para Agregar un nuevo administrador:
router.post(
  "/dashboard/admins",
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
  "/dashboard/admins/:id",
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
  "/dashboard/change_password",
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
router.patch("/dashboard/admins/:id", switchStatus("administrador"));

// Ruta para Actualizar el STATUS de un profesor específico:
router.patch("/dashboard/teachers/:id", switchStatus("profesor"));

// Ruta para Actualizar el STATUS de un estudiante específico:
router.patch("/dashboard/students/:id", switchStatus("alumno"));

// Ruta para ACTIVAR un profesor nuevo que solicita formar parte de la plataforma
router.patch("/dashboard/teachers/:id/admission", admissionTeacher);

module.exports = router;

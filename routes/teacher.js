const express = require("express");
const {
  sendMessage,
  teacherDashboard,
  myStudent,
  updateTeacherInfo,
  acceptContact,
} = require("../controllers/teacherController");
const { managePassword } = require("../controllers/adminController");
const { validarCampos } = require("../validators/validateField");
const { body } = require("express-validator");

const router = express.Router();

/*-------------------------------- Rutas para profesor -------------------------------------------------*/

// Ruta que Devuelve un objeto con los datos del Profesor y ademas una lista de sus estudiantes
router.get("/dashboard", teacherDashboard);

// Ruta que Devuelve un  OBJETO con los datos de un Estudiante y una lista con sus conversaciones
router.get("/dashboard/students/:id", myStudent);

// Ruta que Envia un mensaje al Estudiante
router.post("/dashboard/students/:id/message", sendMessage("profesor"));

// Ruta para Actualizar datos de un Profesor
router.put("/dashboard/change_profile", updateTeacherInfo); 

router.put("/dashboard/change_password",
[
  body("newPassword")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[a-zA-Z]/)
    .withMessage("La contraseña debe contener al menos una letra"),
],
validarCampos, managePassword);

// Ruta para ACTIVAR la relacion entre el Profesor y el Estudiante
router.patch("/dashboard/students/:id/contact", acceptContact);

module.exports = router;

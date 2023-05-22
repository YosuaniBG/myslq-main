const express = require("express");
const {
  sendMessage,
  teacherDashboard,
  myStudent,
  updateTeacherInfo,
  acceptContact,
  managePassword
} = require("../controllers/teacherController");

const router = express.Router();

// Rutas para profesor

router.get("/dashboard", teacherDashboard); //Devuelve un objeto con los datos del Profesor y ademas una lista de sus estudiantes

router.get("/dashboard/students/:id", myStudent); //Devuelve un  OBJETO con los datos de un Estudiante y una lista con sus conversaciones

router.post("/dashboard/students/:id/message", (req, res) => {sendMessage(req, res, "profesor");}); //Envia un mensaje al Estudiante

router.put("/:id", updateTeacherInfo); // Actualizar datos de un Profesor

router.patch("/:id/password", managePassword); // gestionar Contraseña

router.patch("/students/:id/contact", acceptContact); // Esta ruta va a ACTIVAR la relacion entre el Profesor y el Estudiante

module.exports = router;

const express = require("express");
const {
  studentDashboard,
  teachersAvailables,
  myTeacher,
  teacherInfo,
  sendMessage,
  updateStudentInfo,
  contactTeacher,
  ratingAndCommenting,
  managePassword
} = require("../controllers/studentController");

const router = express.Router();

router.get("/dashboard", studentDashboard); //Devuelve un objeto con los datos del estudiantes y ademas una lista de sus profesores

router.get("/dashboard/teachers/:id", myTeacher); //Devuelve un  OBJETO con los datos de un profesor y una lista con sus conversaciones

router.get("/teachers", teachersAvailables); //Devuelve un listado de profesores ACTIVOS

router.get("/teachers/:id", teacherInfo); //Devuelve TODA la informacion de un profesor

router.post("/dashboard/teachers/:id/message", (req, res) => {sendMessage(req, res, "alumno");}); //Envia un mensaje al Profesor

router.put("/:id", updateStudentInfo); // Actualizar datos de un Alumno

router.patch("/:id/password", managePassword); // gestionar Contraseña

router.post("/teachers/:id/contact", contactTeacher); // Esta ruta va a establecer la relacion inicil entre un estudiante y un profesor

router.patch("/teachers/:id/comments", ratingAndCommenting); //Actualiza la Puntuacion y los comentarios que hace un estudiante a un profesor siempre y cuando la relacion este formalizada

module.exports = router;

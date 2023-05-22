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
  managePassword,
  filterBySubject,
  filterByPrice,
  filterByExperience,
  filterCombined
} = require("../controllers/studentController");

const router = express.Router();

router.get("/dashboard", studentDashboard); //Devuelve un objeto con los datos del estudiantes y ademas una lista de sus profesores

router.get("/dashboard/teachers/:id", myTeacher); //Devuelve un  OBJETO con los datos de un profesor y una lista con sus conversaciones

router.get("/teachers", teachersAvailables); //Devuelve un listado de profesores ACTIVOS

//GET api/student/filterBySubject?subject=matematicas
router.get("/teachers/filterBySubject", filterBySubject);

//GET api/student/filterByPrice?min_price=50&max_price=100
router.get("/teachers/filterByPrice", filterByPrice);

//GET api/student/filterByExperience?experience=5
router.get("/teachers/filterByExperience", filterByExperience);

//GET api/student/teachers?subject=ingles&min_price=50&years_of_experience=3
router.get("/teachers/filterCombined", filterCombined);

router.get("/teachers/:id", teacherInfo); //Devuelve TODA la informacion de un profesor

router.post("/dashboard/teachers/:id/message", (req, res) => {sendMessage(req, res, "alumno");}); //Envia un mensaje al Profesor

router.put("/:id", updateStudentInfo); // Actualizar datos de un Alumno

router.patch("/:id/password", managePassword); // gestionar Contraseña

router.post("/teachers/:id/contact", contactTeacher); // Esta ruta va a establecer la relacion inicil entre un estudiante y un profesor

router.patch("/teachers/:id/comments", ratingAndCommenting); //Actualiza la Puntuacion y los comentarios que hace un estudiante a un profesor siempre y cuando la relacion este formalizada



module.exports = router;

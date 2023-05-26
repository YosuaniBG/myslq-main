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
  filterBySubject,
  filterByPrice,
  filterByExperience,
  filterCombined
} = require("../controllers/studentController");
const { managePassword } = require("../controllers/adminController");

const router = express.Router();

//Devuelve un objeto con los datos del estudiantes y ademas una lista de sus profesores
router.get("/dashboard", studentDashboard); 

//Devuelve un  OBJETO con los datos de un profesor y una lista con sus conversaciones
router.get("/dashboard/teachers/:id", myTeacher); 

//Devuelve un listado de profesores ACTIVOS
router.get("/teachers", teachersAvailables); 

//GET api/student/filterBySubject?subject=matematicas
router.get("/teachers/filterBySubject", filterBySubject);

//GET api/student/filterByPrice?min_price=50&max_price=100
router.get("/teachers/filterByPrice", filterByPrice);

//GET api/student/filterByExperience?experience=5
router.get("/teachers/filterByExperience", filterByExperience);

//GET api/student/teachers?subject=ingles&min_price=50&years_of_experience=3
router.get("/teachers/filterCombined", filterCombined);

//Devuelve TODA la informacion de un profesor
router.get("/teachers/:id", teacherInfo); 

//Envia un mensaje al Profesor
router.post("/dashboard/teachers/:id/message", sendMessage("alumno")); 

// Actualizar datos de un Alumno
router.put("/change_profile", updateStudentInfo); 

// gestionar Contraseña
router.patch("/change_password", managePassword); 

 // Esta ruta va a establecer la relacion inicil entre un estudiante y un profesor
 router.post("/teachers/:id/contact", contactTeacher);

//Actualiza la Puntuacion y los comentarios que hace un estudiante a un profesor siempre y cuando la relacion este formalizada
router.patch("/teachers/:id/comments", ratingAndCommenting); 


module.exports = router;

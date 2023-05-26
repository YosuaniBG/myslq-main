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
const { validarCampos } = require("../validators/validateField");
const { body } = require("express-validator");

const router = express.Router();

/*-------------------------------- Rutas para estudiantes -------------------------------------------------*/

// Ruta que Devuelve un objeto con los datos del estudiantes y ademas una lista de sus profesores
router.get("/dashboard", studentDashboard); 

// Ruta que Devuelve un  OBJETO con los datos de un profesor y una lista con sus conversaciones
router.get("/dashboard/teachers/:id", myTeacher); 

// Ruta que Devuelve un listado de profesores ACTIVOS
router.get("/teachers", teachersAvailables); 

// Ruta que ejecuta un filtro para los profesores por materia api/student/teachers/filterBySubject?subject=matematicas
router.get("/teachers/filterBySubject", filterBySubject);

// Ruta que ejecuta un filtro para los profesores por precio api/student/teachers/filterByPrice?min_price=50&max_price=100
router.get("/teachers/filterByPrice", filterByPrice);

// Ruta que ejecuta un filtro para los profesores por experiencia api/student/teachers/filterByExperience?experience=5
router.get("/teachers/filterByExperience", filterByExperience);

// Ruta que ejecuta un filtro combinado para los profesores por materia, precio y experiencia
// api/student/teachers/filterCombined?teachers?subject=ingles&min_price=50&years_of_experience=3
router.get("/teachers/filterCombined", filterCombined);

// Ruta que Devuelve TODA la informacion de un profesor
router.get("/teachers/:id", teacherInfo); 

// Ruta que Envia un mensaje al Profesor
router.post("/dashboard/teachers/:id/message", sendMessage("alumno")); 

 // Ruta para establecer la relacion inicil entre un estudiante y un profesor
 router.post("/teachers/:id/contact", contactTeacher);

// Ruta para Actualizar datos de un Alumno
router.put("/change_profile", [
  body("username")
    .notEmpty().withMessage("Debe incluir el Username"),
  body("fullname")
    .notEmpty().withMessage("Debe incluir el nombre completo"),
  body("email")
    .isEmail().withMessage("Debe incluir el email / email no válido"),
  body("image?")
    .optional().isString().withMessage("Debe incluir una imagen de perfil a traves de un URL")
  ], validarCampos, updateStudentInfo); 

// Ruta para gestionar Contraseña
router.patch("/change_password",[
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
validarCampos, managePassword); 

// Ruta para Actualizar la Puntuacion y los comentarios que hace un estudiante a un profesor siempre y cuando la relacion este formalizada
router.patch("/teachers/:id/comments", [
  body("score")
    .notEmpty().withMessage("Debe incluir el Username")
    .isInt().withMessage("Debe ser un número entero"),
  body("comment")
    .notEmpty().withMessage("Debe incluir el nombre completo"),
  ], validarCampos, ratingAndCommenting); 


module.exports = router;

const express = require("express");
const {
  getOneAdmin,
  getAllUsersByRole,
  newAdmin,
  updateAdminData,
  switchStatus
} = require("../controllers/userController");

const router = express.Router();

// Rutas para Administrador

router.get("/admin/admins/:id", getOneAdmin);           //Obtener información de un administrador específico:
router.get("/admin/admins", (req, res) => {
  getAllUsersByRole(req, res, "administrador");         //Obtener todos los administradores:
});   
router.get("/admin/teachers", (req, res) => {
    getAllUsersByRole(req, res, "profesor");            //Obtener todos los profesores:
}); 
  router.get("/admin/students", (req, res) => {
    getAllUsersByRole(req, res, "alumno");              //Obtener todos los estudiantes:
});                                                   
                        
router.post("/admin/admins", newAdmin);                 //Agregar un nuevo administrador:

router.put("/admin/admins/:id", updateAdminData);       //Actualizar informacion de un administrador específico:

router.patch("/admin/admins/:id", (req, res) => {
    switchStatus(req, res, "administrador");            //Actualizar el STATUS de un administrador específico:
});                    
router.patch("/admin/teachers/:id", (req, res) => {
    switchStatus(req, res, "profesor");                 //Actualizar el STATUS de un profesor específico:
});                     
router.patch("/admin/students/:id", (req, res) => {
    switchStatus(req, res, "alumno");                   //Actualizar el STATUS de un estudiante específico:
});                     

// Rutas para profesor

router.get("teacher/dashboard");
router.get("teacher/students");
router.get("teacher/students/:id");

router.put("teacher/:id");

// Rutas para Estudiantes

router.get("student/:id");
router.get("student/dashboard");
router.get("student/teachers");
router.get("student/teachers/:id");

router.put("student/:id");

router.post("student/teachers/:id/contact");

module.exports = router;

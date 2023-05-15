const express = require("express");
const {
  getOneAdmin,
  getAllUsersByRole,
  newAdmin,
  updateAdminData,
  switchStatus
} = require("../controllers/adminController");

const router = express.Router();

// Rutas para Administrador

router.get("/admins/:id", getOneAdmin);           //Obtener información de un administrador específico:

router.get("/admins", (req, res) => {getAllUsersByRole(req, res, "administrador");});         //Obtener todos los administradores:
  
router.get("/teachers", (req, res) => {getAllUsersByRole(req, res, "profesor");});            //Obtener todos los profesores:
 
router.get("/students", (req, res) => {getAllUsersByRole(req, res, "alumno");});              //Obtener todos los estudiantes:
                                                   
                        
router.post("/admins", newAdmin);                 //Agregar un nuevo administrador:

router.put("/admins/:id", updateAdminData);       //Actualizar informacion de un administrador específico:

router.patch("/admins/:id", (req, res) => {switchStatus(req, res, "administrador");});            //Actualizar el STATUS de un administrador específico:
                    
router.patch("/teachers/:id", (req, res) => {switchStatus(req, res, "profesor");});                 //Actualizar el STATUS de un profesor específico:
                     
router.patch("/students/:id", (req, res) => {switchStatus(req, res, "alumno");});                   //Actualizar el STATUS de un estudiante específico:
   


module.exports = router;
const express = require("express");
const { teachersAvailables } = require("../controllers/studentController");
const router = express.Router();

// Ruta que Devuelve un listado de profesores ACTIVOS
router.get("/teachers", teachersAvailables); 

// Crear una ruta para acceder a los datos de un profesor

module.exports = router;
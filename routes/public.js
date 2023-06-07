const express = require("express");
const { teachersAvailables, filterBySubject, filterByPrice, filterByExperience, filterCombined, teacherInfo } = require("../controllers/publicController");
const router = express.Router();

// Ruta que Devuelve un listado de profesores ACTIVOS
router.get("/teachers", teachersAvailables); 

// Ruta que Devuelve los datos de un profesor
router.get("/teachers/:id", teacherInfo); 

// Rutas para filtros ----------------------------------------------------------------------------------
// Ruta que ejecuta un filtro para los profesores por materia api/public/teachers/filterBySubject?subject=matematicas
router.get("/teachers/filterBySubject", filterBySubject);

// Ruta que ejecuta un filtro para los profesores por precio api/public/teachers/filterByPrice?min_price=50&max_price=100
router.get("/teachers/filterByPrice", filterByPrice);

// Ruta que ejecuta un filtro para los profesores por experiencia api/public/teachers/filterByExperience?experience=5
router.get("/teachers/filterByExperience", filterByExperience);

// Ruta que ejecuta un filtro combinado para los profesores por materia, precio y experiencia
// api/public/teachers/filterCombined?teachers?subject=ingles&min_price=50&years_of_experience=3
router.get("/teachers/filterCombined", filterCombined);

module.exports = router;
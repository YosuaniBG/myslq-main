const express = require('express');


const router = express.Router()

// Rutas para Administrador 

router.get("/admin/:id", )
router.put("/admin/:id", )
router.delete("/admin/:id", )
router.get("/admin/dashboard", )
router.get("/admin/teachers", )
router.get("/admin/students", )
router.put("/admin/teachers/:id", )
router.delete("/admin/teachers/:id", )
router.put("/admin/students/:id", )
router.delete("/admin/students/:id", )

// Rutas para profesor

router.get("teacher/:id", )
router.put("teacher/:id", )
router.get("teacher/dashboard", )
router.get("teacher/students", )
router.get("teacher/students/:id", )

// Rutas para Estudiantes

router.get("student/:id", )
router.put("student/:id", )
router.get("student/dashboard", )
router.get("student/teachers", )
router.get("student/teachers/:id", )


module.exports = router;


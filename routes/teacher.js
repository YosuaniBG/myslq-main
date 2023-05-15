const express = require("express");

const router = express.Router();

// Rutas para Administrador                   

// Rutas para profesor

router.get("/dashboard");
router.get("/students");
router.get("/students/:id");

router.put("/:id");


module.exports = router;
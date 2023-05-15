const express = require("express");
const { studentDashboard, teachersAvailables, myTeacher, teacherInfo } = require("../controllers/studentController");

const router = express.Router();

router.get("/dashboard", studentDashboard);  //Devuelve un objeto con los datos del estudiantes y ademas una lista de sus profesores

router.get("/dashboard/teachers/:id", myTeacher);   //Devuelve un  OBJETO con los datos de un profesor y un lista con sus conversaciones

router.get("/teachers", teachersAvailables);        //Devuelve un listado de profesores ACTIVOS

router.get("/teachers/:id", teacherInfo);   //Devuelve TODA la informacion de un profesor

router.put("/:id");

router.post("/teachers/:id/contact");

router.patch("/teachers/:id/comments");

module.exports = router;
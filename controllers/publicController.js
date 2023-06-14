
const {
    getTeachersAvailables,
    teachersBySubject,
    teachersByPrice,
    teachersByExperience,
    teachersBy,
    getTeacherById,
    getTeacherAverage,
    getTeacherComments,
  } = require("../models/userModel");
  
  // Manejador que muestra un listado de todos los profesores HABILITADOS en la BD
  const teachersAvailables = async (req, res) => {
    try {
      const [teachers] = await getTeachersAvailables();
  
      //Verifica si la lista de profesores esta vacia o no
      if(!teachers[0]){
        return res.status(404).json({
          msg: "No hay profesores disponibles",
        });
      }
  
      res.send({
        teachers,
      });
  
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
  
  // Manejador para filtar una lista de profesores por materia
  const filterBySubject = async (req, res) => {
    try {
      const { subject } = req.query;
      const data = await teachersBySubject(subject);
  
      if(!data[0]){
        return res.status(404).send({
          msg: "No se encontro ningún profesor con esta materia",
        });
      }
  
      res.send({
        results: data,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: error.message,
      });
    }
  };
  
  // Manejador para filtar una lista de profesores por precio
  const filterByPrice = async (req, res) => {
    try {
      const { min_price, max_price } = req.query;
      const [data] = await teachersByPrice(min_price, max_price);
  
      if(!data[0]){
        return res.status(404).send({
          msg: "No se encontro ningún profesor con este rango de precio",
        });
      }
  
      res.send({
        results: data,
      });
  
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
  
  // Manejador para filtar una lista de profesores por experiencia
  const filterByExperience = async (req, res) => {
    try {
      const { experience } = req.query;
      const [data] = await teachersByExperience(experience);
  
      if(!data[0]){
        return res.status(404).send({
          msg: `No se encontro ningún profesor con ${experience} años de experiencia`
        });
      }
  
      res.send({
        results: data,
      });
  
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
  
  // Manejador para filtar una lista de profesores por materia, precio y experiencia
  const filterCombined = async (req, res) => {
    try {
      const { subject, min_price, max_price, experience } = req.query;
      const data = await teachersBy(subject, min_price, max_price, experience);
  
      if(!data[0]){
        return res.status(404).send({
          msg: `No se encontro ningún profesor que cumpla con estas condiciones`
        });
      }
  
      res.send({
        results: data,
      });
  
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };

  // Manejador que muestra los datos de un profesor registrado en el sistema que este ACTIVO 
const teacherInfo = async (req, res) => {
  try {
    const id_teacher = req.params.id;
    const [teacher] = await getTeacherById(id_teacher);
    const [teacherAVG] = await getTeacherAverage(id_teacher);
    const [teacherComments] = await getTeacherComments(id_teacher);

    //Verifica si el identificador dado corresponde a un profesor
    if (!teacher[0]) {
      return res.status(404).json({
        msg: "No existe ningún profesor con este id",
      });
    }

    res.send({
      teacher,
      teacherAVG,
      teacherComments
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
  
  
  module.exports = {
    teachersAvailables,
    filterBySubject,
    filterByPrice,
    filterByExperience,
    filterCombined,
    teacherInfo
  };
  
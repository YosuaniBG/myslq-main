
const {
  getAllMyTeachers,
  getTeachersAvailables,
  getMessages,
  insertMessage,
  updateStudent,
  insertRelationship,
  updateRelationship,
  getRelationship,
  getStudentById,
  getTeacherById,
  teachersBySubject,
  teachersByPrice,
  teachersByExperience,
  teachersBy
} = require("../models/userModel");

const studentDashboard = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const [user] = await getStudentById(id_student);
    const [teachers] = await getAllMyTeachers(id_student);

    if (!user[0]) {
      return res.status(404).json({
        msg: "No existe ningún estudiante con este id",
      });
    }

    res.send({
      user,
      teachers,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const teachersAvailables = async (req, res) => {
  try {
    const [teachers] = await getTeachersAvailables();

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

const myTeacher = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const id_teacher = req.params.id;
    const [teacher] = await getTeacherById(id_teacher);
    const [chat] = await getMessages(id_teacher, id_student);

    if (!teacher[0]) {
      return res.status(404).json({
        msg: "Este alumno no tiene profesores con este Id",
      });
    }

    res.send({
      teacher,
      chat,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const teacherInfo = async (req, res) => {
  try {
    const id_teacher = req.params.id;
    const [teacher] = await getTeacherById(id_teacher);

    if (!teacher[0]) {
      return res.status(404).json({
        msg: "No existe ningún profesor con este id",
      });
    }

    res.send({
      teacher,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const sendMessage = (sender) => {
  return async (req, res) => {
    try {
      const sender_user = req.user.id_user;
      const receiver_user = req.params.id;
      const message = req.body.message;
  
      const [student] = await getStudentById(sender_user);
      const [teacher] = await getTeacherById(receiver_user);
  
      if (!student[0] || !teacher[0]) {
        return res.status(404).send({
          msg: "No es posible establecer comunicación entre estos dos usuarios",
        });
      }
      const [chat] = await insertMessage(sender_user, receiver_user, sender, message);
  
      res.send({
        msg: 'Mensaje enviado',
        chat
      });
  
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
}

const updateStudentInfo = async (req, res) => {
  try {
    const [data] = await updateStudent(req.user.id_user, req.body);

    res.send({
      msg: 'Actualización satisfactoria',
      userUpdated: data,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const contactTeacher = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const id_teacher = req.params.id;
    const [student] = await getStudentById(id_student);
    const [teacher] = await getTeacherById(id_teacher);

    if (!student[0] || !teacher[0]) {
      return res.status(404).send({
        msg: "No es posible establecer la relacion entre estos usuarios",
      });
    }

    const [data] = await insertRelationship(id_teacher, id_student);

    res.send({
      contact:
        "Se ha establecido contacto con este profesor, espere a que su solicitud sea aceptada por el profesor...",
      data: data,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const ratingAndCommenting = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const id_teacher = req.params.id;
    const comment = req.body.comment;
    const score = req.body.score;

    const [userData] = await getRelationship(id_teacher, id_student);

    if (!userData[0]) {
      return res.status(404).json({
        msg: "Esta relacion Alumno - Profesor no existe",
      });
    }

    const [data] = await updateRelationship(
      id_teacher,
      id_student,
      score,
      comment
    );

    if (userData[0].status == 0) {
      res.status(404).send({
        msg: "La comunicación con este profesor aun no ha sido aprobada",
      });
    } else {
      res.send({
        msg: 'Su información ha sido enviada',
        comment: data,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};


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

const filterCombined = async (req, res) => {
  try {
    const { subject, min_price, max_price, experience } = req.query;
    const data = await teachersBy(subject, min_price, max_price, experience);

    if(!data){
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


module.exports = {
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
};

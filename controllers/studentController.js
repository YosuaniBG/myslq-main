
const {
  getAllMyTeachers,
  getMessages,
  insertMessage,
  updateStudent,
  insertRelationship,
  updateRelationship,
  getRelationship,
  getTeacherById,
  getMyTeacher
} = require("../models/userModel");

// Manejador para obtener los datos del usuario registrado y sus profesores
const studentDashboard = async (req, res) => {
  try {
    const [teachers] = await getAllMyTeachers(req.user.id_user);

    let info;

    // Verifica si la consulta devuelve un listado de profesores del estudiante loggeado
    !teachers[0]
      ? (info = "Aún no tiene profesores contratados")
      : (info = teachers);

    res.send({
      student: req.user,
      teachers: info,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para obtener todos los datos de un profesor contratado por el estudiante registrado
const myTeacher = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const id_teacher = req.params.id;
    const [teacher] = await getMyTeacher(id_student, id_teacher);
    const [chat] = await getMessages(id_teacher, id_student);

    if (!teacher[0]) {
      return res.status(404).json({
        msg: "El usuario con este id no está reconocido como uno de mis profesores",
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

// Manejador que muestra los datos de un profesor registrado en el sistema que este ACTIVO 
const teacherInfo = async (req, res) => {
  try {
    const id_teacher = req.params.id;
    const [teacher] = await getTeacherById(id_teacher);

    //Verifica si el identificador dado corresponde a un profesor
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

// Manejador para enviar mensajes a un profesor que este previamente contratado con el estudiante loggeado 
const sendMessage = (sender) => {
  return async (req, res) => {
    try {
      const sender_user = req.user.id_user;
      const receiver_user = req.params.id;
      const message = req.body.message;
  
      const [teacher] = await getTeacherById(receiver_user);
  
       //Verifica que el id proporcionado corresponda a un profesor
      if (!teacher[0]) {
        return res.status(404).send({
          msg: "No es posible establecer comunicación entre estos dos usuarios",
        });
      }

      const [userData] = await getRelationship(receiver_user, sender_user);

      //Verifica que la relacion entre estos dos ususario EXISTA
      if(!userData[0]){
        return res.status(404).json({
          msg: "Esta relacion Alumno - Profesor no existe",
        });
      }

      //Verifica que la relación existente este ACTIVA
      if (userData[0].status === 0) {
        return res.status(404).json({
          msg: "Esta relacion Alumno - Profesor no está activa",
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

// Manejador para atualizar los datos del estudiante
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

// Manejador para iniciar la relacion Alumno - profesor al establecer contacto con el profesor
const contactTeacher = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const id_teacher = req.params.id;
    const [teacher] = await getTeacherById(id_teacher);

    //Verifica si el id corresponde a un profesor ACTIVO o no
    if (!teacher[0]) {
      return res.status(404).send({
        msg: "No es posible establecer la relacion con este usuario",
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

// Manejador para actualizar una puntuacion y un comentario a uno de los profesores del estudiante loggeado
const ratingAndCommenting = async (req, res) => {
  try {
    const id_student = req.user.id_user;
    const id_teacher = req.params.id;
    const comment = req.body.comment;
    const score = req.body.score;

    const [teacher] = await getTeacherById(id_teacher);

    //Verifica que el usuario sea un profesor ACTIVO o no
    if (!teacher[0]) {
      return res.status(404).send({
        msg: "Este usuario no es compatible",
      });
    }

    const [userData] = await getRelationship(id_teacher, id_student);

    //Verifica que exista una relacion Alumno - profesor previa entre estos usuarios
    if (!userData[0]) {
      return res.status(404).json({
        msg: "Esta relacion Alumno - Profesor no existe",
      });
    }

    //Verifica que la relación existente este ACTIVA
    if (userData[0].status === 0) {
      return res.status(404).json({
        msg: "La comunicación con este profesor aun no ha sido aprobada",
      });
    }

    const [data] = await updateRelationship(id_teacher, id_student, score, comment);

    res.send({
      msg: 'Su información ha sido enviada',
      comment: data,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};


module.exports = {
  studentDashboard,
  myTeacher,
  teacherInfo,
  sendMessage,
  updateStudentInfo,
  contactTeacher,
  ratingAndCommenting,
};

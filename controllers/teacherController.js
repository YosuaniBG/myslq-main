const {
  getStudentById,
  getMessages,
  activeRelationship,
  updateTeacher,
  getMyStudent,
  insertMessage,
  getRelationship,
  getAllMyStudentsActive,
  getAllMyStudentsPending,
} = require("../models/userModel");

// Manejador para obtener los datos del profesor loggeado y sus estudiantes
const teacherDashboard = async (req, res) => {
  try {
    const [studentsActive] = await getAllMyStudentsActive(req.user.id_user);
    const [studentsPending] = await getAllMyStudentsPending(req.user.id_user);

    let active;
    let pending;

    // Verifica si la consulta devuelve un listado de estudiantes del profesor loggeado
    !studentsActive[0]
      ? (active = "Aún no tiene estudiantes registrados con usted")
      : (active = studentsActive);

    !studentsPending[0]
      ? (pending = "No tiene solicitudes de estudiantes pendiente")
      : (pending = studentsPending);

    res.send({
      teacher: req.user,
      studentsActive: active,
      studentsPending: pending,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para obtener los datos de uno de los alumnos del profesor loggeado
const myStudent = async (req, res) => {
  try {
    const id_teacher = req.user.id_user;
    const id_student = req.params.id;
    const [student] = await getMyStudent(id_teacher, id_student);
    const [chat] = await getMessages(id_teacher, id_student);

    // Verifica si el id proporcionado coincide con uno de los estudiantes inscritos con este profesor
    if (!student[0]) {
      return res.status(404).json({
        msg: "El usuario con este id no está reconocido como uno de mis estudiantes",
      });
    }

    res.send({
      student,
      chat,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para enviar mensajes a un estudiante que este previamente inscrito con el profesor loggeado
const sendMessage = (sender) => {
  return async (req, res) => {
    try {
      const sender_user = req.user.id_user;
      const receiver_user = req.params.id;
      const message = req.body.message;

      const [student] = await getStudentById(receiver_user);

      //Verifica que el id proporcionado corresponda a un estudiante
      if (!student[0]) {
        return res.status(404).send({
          msg: "No es posible establecer comunicación entre estos dos usuarios",
        });
      }

      const [userData] = await getRelationship(sender_user, receiver_user);

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

      const [chat] = await insertMessage(
        sender_user,
        receiver_user,
        sender,
        message
      );

      res.send({
        msg: "Mensaje enviado",
        chat,
      });

    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
};

//Manejador para atualizar los datos del profesor
const updateTeacherInfo = async (req, res) => {
  try {
    const [data] = await updateTeacher(req.user.id_user, req.body);

    res.send({
      msg: "Actualización satisfactoria",
      userUpdated: data,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para ACEPTAR la solicitud de contacto hecha por un estudiante
const acceptContact = async (req, res) => {
  try {
    const id_student = req.params.id;
    const id_teacher = req.user.id_user;
    const [data] = await activeRelationship(id_teacher, id_student);

    // Verifica que el id proporcionado haya inicializado el contacto con este profesor
    if (data.changedRows === 0 && data.affectedRows === 0) {
      return res.send({
        msg: "Este usuario no ha solicitado entrar en contacto con usted",
        userUpdated: data,
      });
    }

    //Valida si ya el usuario ha sido aceptado
    if (data.changedRows === 0 && data.affectedRows !== 0) {
      return res.send({
        msg: "Este alumno ya ha sido aceptado previamente",
        userUpdated: data,
      });
    }

    res.send({
      msg: "Alumno aceptado",
      userUpdated: data,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

module.exports = {
  teacherDashboard,
  myStudent,
  sendMessage,
  updateTeacherInfo,
  acceptContact,
};

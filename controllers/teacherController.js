const {
  getStudentById,
  getTeacherById,
  getAllMyStudents,
  getMessages,
  activeRelationship,
  updateTeacher,
  getMyStudent,
  insertMessage,
} = require("../models/userModel");

const teacherDashboard = async (req, res) => {
  try {
    const [students] = await getAllMyStudents(req.user.id_user);

    let info;
    !students[0]
      ? (info = "Aún no tiene estudiantes registrados con usted")
      : (info = students);

    res.send({
      teacher: req.user,
      students: info,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const myStudent = async (req, res) => {
  try {
    const id_teacher = req.user.id_user;
    const id_student = req.params.id;
    const [student] = await getMyStudent(id_teacher, id_student);
    const [chat] = await getMessages(id_teacher, id_student);

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

const sendMessage = (sender) => {
  return async (req, res) => {
    try {
      const sender_user = req.user.id_user;
      const receiver_user = req.params.id;
      const message = req.body.message;

      const [student] = await getStudentById(receiver_user);
      const [teacher] = await getTeacherById(sender_user);

      if (!student[0] || !teacher[0]) {
        return res.status(404).send({
          msg: "No es posible establecer comunicación entre estos dos usuarios",
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

const updateTeacherInfo = async (req, res) => {
  try {
    req.body.subjects = JSON.stringify(req.body.subjects);
    req.body.location = JSON.stringify(req.body.location);
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

const acceptContact = async (req, res) => {
  try {
    const id_student = req.params.id;
    const id_teacher = req.user.id_user;

    const [data] = await activeRelationship(id_teacher, id_student);

    if (data.changedRows === 0 && data.affectedRows === 0) {
      return res.send({
        msg: "Este usuario no ha solicitado entrar en contacto con usted",
        userUpdated: data,
      });
    }

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

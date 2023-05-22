const {
  getStudentById,
  getTeacherById,
  getAllMyStudents,
  getMessages,
  activeRelationship,
  updatePassword,
} = require("../models/userModel");

const teacherDashboard = async (req, res) => {
  try {
    const [user] = await getTeacherById(req.body.id);
    const [students] = await getAllMyStudents(req.body.id);

    if (!user[0]) {
      return res.status(404).json({
        msg: "No existe ningún profesor con este id",
      });
    }

    res.status(200).send({
      user,
      students,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const myStudent = async (req, res) => {
  try {
    const id_teacher = req.body.id;
    const id_student = req.params.id;
    const [student] = await getStudentById(id_student);
    const [chat] = await getMessages(id_teacher, id_student);

    if (!student[0]) {
      return res.status(404).json({
        msg: "No existe ningún estudiante con este id",
      });
    }

    res.status(200).send({
      student,
      chat,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const sendMessage = async (req, res, sender) => {
  try {
    const id_teacher = req.body.id;
    const id_student = req.params.id;
    const message = req.body.message;

    const [student] = await getStudentById(id_student);
    const [teacher] = await getTeacherById(id_teacher);

    if (!student[0] || !teacher[0]) {
      return res.status(404).send({
        msg: "No es posible establecer comunicación entre estos dos usuarios",
      });
    }
    const [chat] = await insertMessage(id_teacher, id_student, sender, message);

    res.status(200).send({
      chat,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const updateTeacherInfo = async (req, res) => {
  try {
    const [data] = await updateTeacher(req.params.id, req.body);

    res.status(200).send({
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
    const id_teacher = req.body.id;

    const [data] = await activeRelationship(id_teacher, id_student);

    res.status(200).send({
      userUpdated: data,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

const managePassword = async (req, res) => {
  try {
    const password = await encrypt(req.body.password)
    const [data] = await updatePassword(req.params.id, password);

    res.status(200).send({
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
  managePassword,
};

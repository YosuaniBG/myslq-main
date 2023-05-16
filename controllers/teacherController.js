const {
  getStudentById,
  getTeacherById,
  getAllMyStudents,
  getUserById,
  getMessages,
  activeRelationship,
  updatePassword,
} = require("../models/userModel");

const teacherDashboard = async (req, res) => {
  try {
    const [user] = await getUserById(req.body.id);
    const [students] = await getAllMyStudents(req.body.id);

    if (!user[0]) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    res.send({
      user,
      students,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const myStudent = async (req, res) => {
  try {
    const id_teacher = req.body.id;
    const id_student = req.params.id;
    const [student] = await getUserById(id_student);
    const [chat] = await getMessages(id_teacher, id_student);

    if (!student[0]) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    res.send({
      student,
      chat,
    });
  } catch (error) {
    res.status(400).json({
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
      return res.send({
        msg: "No es posible establecer comunicación entre estos dos usuarios",
      });
    }
    const [chat] = await insertMessage(id_teacher, id_student, sender, message);

    res.send({
      chat,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const updateTeacherInfo = async (req, res) => {
  try {
    const [data] = await updateTeacher(req.params.id, req.body);

    res.send({
      userUpdated: data,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const acceptContact = async (req, res) => {
  try {
    const id_student = req.params.id;
    const id_teacher = req.body.id;

    const [data] = await activeRelationship(id_teacher, id_student);

    res.send({
      userUpdated: data,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const managePassword = async (req, res) => {
  try {
    const password = await encrypt(req.body.password)
    const [data] = await updatePassword(req.params.id, password);

    res.send({
      userUpdated: data,
    });
  } catch (error) {
    res.status(400).json({
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

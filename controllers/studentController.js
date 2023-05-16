const {
  getAllMyTeachers,
  getTeachersAvailables,
  getMessages,
  getUserById,
  insertMessage,
  updateStudent,
  insertRelationship,
  updateRelationship,
  getRelationship,
  getStudentById,
  getTeacherById,
} = require("../models/userModel");

const studentDashboard = async (req, res) => {
  try {
    const [user] = await getUserById(req.body.id);
    const [teachers] = await getAllMyTeachers(req.body.id);

    if (!user[0]) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    res.send({
      user,
      teachers,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const teachersAvailables = async (req, res) => {
  try {
    const [teachers] = await getTeachersAvailables();

    res.send({
      teachers,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const myTeacher = async (req, res) => {
  try {
    const id_student = req.body.id;
    const id_teacher = req.params.id;
    const [teacher] = await getUserById(id_teacher);
    const [chat] = await getMessages(id_teacher, id_student);

    if (!teacher[0]) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    res.send({
      teacher,
      chat,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const teacherInfo = async (req, res) => {
  try {
    const [teacher] = await getUserById(id_teacher);

    if (!teacher[0]) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    res.send({
      teacher,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const sendMessage = async (req, res, sender) => {
  try {
    const id_student = req.body.id;
    const id_teacher = req.params.id;
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

const updateStudentInfo = async (req, res) => {
  try {
    const [data] = await updateStudent(req.params.id, req.body);

    res.send({
      userUpdated: data,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const contactTeacher = async (req, res) => {
  try {
    const id_student = req.body.id;
    const id_teacher = req.params.id;
    const [student] = await getStudentById(id_student);
    const [teacher] = await getTeacherById(id_teacher);

    if (!student[0] || !teacher[0]) {
      return res.send({
        msg: "No es posible establecer la relacion entre estos usuarios",
      });
    }

    const [data] = await insertRelationship(id_teacher, id_student);

    res.send({
      contact:
        "Se ha establecido contacto con este profesor, espere a ser atendido por el profesor...",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const ratingAndCommenting = async (req, res) => {
  try {
    const id_student = req.body.id;
    const id_teacher = req.params.id;
    const comment = req.body.comment;
    const score = req.body.score;

    const [userData] = await getRelationship(id_teacher, id_student);

    if (!userData[0]) {
      return res.status(400).json({
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
      res.send({
        msg: "La comunicación con este profesor aun no ha sido aprobada",
      });
    } else {
      res.send({
        comment: data,
      });
    }
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const managePassword = async (req, res) => {
  try {
    const password = await encrypt(req.body.password);
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
  studentDashboard,
  teachersAvailables,
  myTeacher,
  teacherInfo,
  sendMessage,
  updateStudentInfo,
  contactTeacher,
  ratingAndCommenting,
  managePassword,
};

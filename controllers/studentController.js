const { getAllMyTeachers, getTeachersAvailables, getMessages, getUserById } = require("../models/userModel");

const studentDashboard = async (req, res) => {
    try {  
        const [user] = await getUserById(req.body.id);
        const [teachers] = await getAllMyTeachers(req.body.id);

        res.send({
            user,
            teachers
          })      

      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
};

const teachersAvailables = async (req, res) => {
    try {  
        const [teachers] = await getTeachersAvailables();

        res.send({
            teachers
          })      

      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
};

const myTeacher = async (req, res) => {
    try {  
        const id_student = req.body.id;
        const id_teacher = req.params.id;
        const [teacher] = await getUserById(id_teacher);
        const [chat] = await getMessages(id_teacher, id_student);

        res.send({
            teacher,
            chat
          })      

      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
};

const teacherInfo = async (req, res) => {
    try {  
        const [teacher] = await getUserById(id_teacher);

        res.send({
            teacher
          })      

      } catch (error) {
        res.status(400).json({
          msg: error.message
        });
      }
};



module.exports = {
    studentDashboard,
    teachersAvailables,
    myTeacher,
    teacherInfo
};
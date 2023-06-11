const { filterSubject } = require('../utility/helpers');

const db = require('../database/dbConfig').promise();

/*----------------------------- Consultas SQL ---------------------------------------------- */

const getUserById = (id) => {
    return db.query('SELECT * FROM users WHERE id_user = ?', [id]);
}

const getTeacherById = (id) => {
    return db.query("SELECT * FROM users WHERE id_user = ? AND rol = 'profesor' AND status = 1 AND active = 1", [id]);
}

const getStudentById = (id) => {
    return db.query("SELECT * FROM users WHERE id_user = ? AND rol = 'alumno' AND status = 1", [id]);
}

const getUsers = (rol = "") => {
    if(rol == ""){
        return db.query('SELECT * FROM users');
    }else{
        return db.query('SELECT * FROM users WHERE rol = ?', [rol]);
    }     
}

const insertAdmin = ({username, fullname, email, password}) => {
    return db.query("INSERT INTO users (username, fullname, email, password, rol) VALUES (?,?,?,?,'administrador')", 
    [username, fullname, email, password]); 
}

const updateAdmin = (id, {username, fullname, email, image, description}) => {
    return db.query("UPDATE users SET username = ?, fullname = ?, email = ?, image = ?, description = ? WHERE id_user = ? AND rol = 'administrador'", 
    [username, fullname, email, image, description, id]);
}

const updateStudent = (id, {username, fullname, email, image, phone, description}) => {
    return db.query("UPDATE users SET username = ?, fullname = ?, email = ?, image = ?, phone = ?, description = ? WHERE id_user = ? AND rol = 'alumno'", 
    [username, fullname, email, image, phone, description, id]);
}

const updateTeacher = (id, {username, fullname, email, image, phone, location, subjects, description, brief_description, cover, price, experience}) => {
    return db.query("UPDATE users SET username = ?, fullname = ?, email = ?, image = ?, phone = ?, location = ?, subjects = ?, description = ?, brief_description = ?, cover = ?, price = ?, experience = ? WHERE id_user = ? AND rol = 'profesor'", 
    [username, fullname, email, image, phone, location, subjects, description, brief_description, cover, price, experience, id]);
}

const updateUserStatus = (id,rol,status) => {
    return db.query('UPDATE users SET status = ? WHERE rol = ? AND id_user = ?', 
    [status, rol, id]);
}

const updateRelationship = (id_teacher, id_student, score, comment) => {
    return db.query('UPDATE teachers_students SET score = ?, comments = ? WHERE id_teacher = ? AND id_student = ? AND status = 1', 
    [score, comment, id_teacher, id_student]);
}

const activeRelationship = (id_teacher, id_student) => {
    return db.query('UPDATE teachers_students SET status = 1 WHERE id_teacher = ? AND id_student = ?', 
    [id_teacher, id_student]);
}

const getRelationship = (id_teacher, id_student) => {
    return db.query('SELECT * FROM teachers_students WHERE id_teacher = ? AND id_student = ?', 
    [id_teacher, id_student]);
}

const getAllMyTeachers = (id) => {
    return db.query('SELECT u.*, ts.status as relationship FROM users as u JOIN teachers_students as ts ON u.id_user = ts.id_teacher WHERE ts.id_student = ? AND u.status = 1', [id]);
}

const getAllMyStudents = (id) => {
    return db.query('SELECT u.* FROM users as u JOIN teachers_students as ts ON u.id_user = ts.id_student WHERE ts.id_teacher = ? AND ts.status = 1', [id]);
}

const getMyStudent = (id_teacher, id_student) => {
    return db.query('SELECT u.* FROM users as u JOIN teachers_students as ts ON ts.id_student = u.id_user WHERE ts.id_teacher = ? AND ts.id_student = ? AND ts.status = 1', [id_teacher, id_student]);
}

const getMyTeacher = (id_student, id_teacher) => {
    return db.query('SELECT u.* FROM users as u JOIN teachers_students as ts ON ts.id_teacher = u.id_user WHERE ts.id_teacher = ? AND ts.id_student = ? AND u.status = 1', [id_teacher, id_student]);
}

const getTeachersAvailables = () => {
    return db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1 AND active = 1");
}

const getMessages = (id_teacher, id_student) => {
    return db.query('SELECT * FROM messages WHERE id_teacher = ? AND id_student = ?', [id_teacher, id_student]);
}

const insertMessage = (id_teacher, id_student, sender, message) => {
    return db.query('INSERT INTO messages (id_teacher, id_student, sender, message) VALUES (?,?,?,?)', [id_teacher, id_student, sender, message]);
}

const insertRelationship = (id_teacher, id_student) => {
    return db.query('INSERT INTO teachers_students (id_teacher, id_student) VALUES (?,?)', [id_teacher, id_student]);
}

const updatePassword = (id, password) => {
    return db.query('UPDATE users SET password = ? WHERE id_user = ?', 
    [password, id]);
}

const teachersBySubject = async (subject) => {
    const [teachers] = await db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1 AND active = 1");
   
    return filterSubject(teachers, subject);
}

const teachersByPrice = (min, max) => {
    return db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1 AND active = 1 AND price >= ? AND price <= ?", 
    [min, max]);
}

const teachersByExperience = (experience) => {
    return db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1 AND active = 1 AND experience = ?", 
    [experience]);
}

const teachersBy = async (subject, min_price=0, max_price, experience) => {
    const [teachers] = await db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1 AND active = 1 AND price >= ? AND price <= ? AND experience = ?", 
    [min_price, max_price, experience]);

    return filterSubject(teachers,subject);
}

const admission = (id) => {
    return db.query(`UPDATE users SET active = 1 WHERE id_user = ? AND rol = 'profesor'`, 
    [id]);
}

module.exports = {
    getUsers,
    getUserById,
    getTeacherById,
    getStudentById,
    getAllMyTeachers,
    getAllMyStudents,
    getMyStudent,
    getMyTeacher,
    getTeachersAvailables,
    getMessages,
    getRelationship,
    teachersBySubject,
    teachersByPrice,
    teachersByExperience,
    teachersBy,

    insertAdmin,
    insertMessage,
    insertRelationship,

    updateAdmin,
    updateStudent,
    updateTeacher,
    updateUserStatus,
    updatePassword,
    updateRelationship,
    activeRelationship,
    admission
}
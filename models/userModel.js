const db = require('../database/dbConfig').promise();

//Consulta para obtner lista de usuarios
const getUserById = (id) => {
    return db.query('SELECT * FROM users WHERE id_user = ?', [id]);
}

const getTeacherById = (id) => {
    return db.query("SELECT * FROM users WHERE id_user = ? AND rol = 'profesor'", [id]);
}

const getStudentById = (id) => {
    return db.query("SELECT * FROM users WHERE id_user = ? AND rol = 'alumno'", [id]);
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

const updateAdmin = (id, {username, fullname, email}) => {
    return db.query('UPDATE users SET username = ?, fullname = ?, email = ? WHERE id_user = ?', 
    [username, fullname, email, id]);
}

const updateStudent = (id, {username, fullname, email, image}) => {
    return db.query('UPDATE users SET username = ?, fullname = ?, email = ?, image = ? WHERE id_user = ?', 
    [username, fullname, email, image, id]);
}

const updateTeacher = (id, {username, fullname, email, image, phone, location, subjects, description, brief_description, price, experience}) => {
    return db.query('UPDATE users SET username = ?, fullname = ?, email = ?, image = ? phone = ?, location = ?, subjects = ?, description = ?, brief_description = ?, price = ?, experience = ? WHERE id_user = ?', 
    [username, fullname, email, image, phone, location, subjects, description, brief_description, price, experience, id]);
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
    return db.query('SELECT u.* FROM users as u JOIN teachers_students as ts ON u.id_user = ts.id_teacher WHERE ts.id_student = ? AND ts.status = 1', [id]);
}

const getAllMyStudents = (id) => {
    return db.query('SELECT u.* FROM users as u JOIN teachers_students as ts ON u.id_user = ts.id_student WHERE ts.id_teacher = ? AND ts.status = 1', [id]);
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

const filter = (array, subject) => {
    let result = [];
    for (let elem of array){
        let include = JSON.parse(elem.subjects).includes(subject)
       
        if(include){
            result.push(elem);
        }       
    }
    return result;
}

const teachersBySubject = async (subject) => {
    const [teachers] = await db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1 AND active = 1");
   
    return filter(teachers, subject);
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

    return filter(teachers,subject);
}


module.exports = {
    getUsers,
    getUserById,
    getTeacherById,
    getStudentById,
    getAllMyTeachers,
    getAllMyStudents,
    getTeachersAvailables,
    getMessages,
    insertAdmin,
    insertMessage,
    updateAdmin,
    updateStudent,
    updateTeacher,
    updateUserStatus,
    updatePassword,
    insertRelationship,
    updateRelationship,
    getRelationship,
    activeRelationship,
    teachersBySubject,
    teachersByPrice,
    teachersByExperience,
    teachersBy
}
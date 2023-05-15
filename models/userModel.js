const db = require('../dbConfig').promise();

//Consulta para obtner lista de usuarios
const getUserById = (id) => {
    return db.query('SELECT * FROM users WHERE id_user = ?', [id]);
}

const getUsers = (rol = "") => {
    if(rol == ""){
        return db.query('SELECT * FROM users');
    }else{
        return db.query('SELECT * FROM users WHERE rol = ?', [rol]);
    }     
}

const createAdmin = ({username, fullname, email, password}) => {
    return db.query("INSERT INTO users (username, fullname, email, password, rol) VALUES (?,?,?,?,'administrador')", 
    [username, fullname, email, password]); 
}

const updateAdmin = (id, {username, fullname, email}) => {
    return db.query('UPDATE users SET username = ?, fullname = ?, email = ? WHERE id_user = ?', 
    [username, fullname, email, id]);
}

const updateUserStatus = (id,rol,status) => {
    return db.query('UPDATE users SET status = ? WHERE rol = ? AND id_user = ?', 
    [status, rol, id]);
}

const getAllMyTeachers = (id) => {
    return db.query('SELECT u.* FROM users as u JOIN teachers_students as ts ON u.id_user = ts.id_teacher WHERE ts.id_student = ? AND ts.status = 1;', [id]);
}

const getTeachersAvailables = () => {
    return db.query("SELECT * FROM users WHERE rol = 'profesor' AND status = 1;");
}

const getMessages = (id_teacher, id_student) => {
    return db.query("SELECT * FROM messages WHERE id_teacher = ? AND id_student = ?;", [id_teacher, id_student]);
}






module.exports = {
    getUsers,
    getUserById,
    createAdmin,
    updateAdmin,
    updateUserStatus,
    getAllMyTeachers,
    getTeachersAvailables,
    getMessages
}
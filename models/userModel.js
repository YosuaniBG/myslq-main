const db = require('../dbConfig').promise();

//Consulta para obtner lista de usuarios
const getAll = () => {
    return db.query('SELECT * FROM users');
}

const registrarUser = ({username, fullname, email, password, rol}) =>{
    return db.query('INSERT INTO users (username, fullname, email, password, rol) VALUES (?,?,?,?,?)', 
    [username, fullname, email, password, rol]);
};

const readUser = (id) => {
    return db.query('SELECT * FROM users WHERE id_user = ?', [id]);
}

const findUserByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
}

const updateStudent = (id, {username, fullname, email, password, image, phone, location, subjects}) => {
    return db.query('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', 
    [username, fullname, email, password, image, phone, location, subjects, id]);
}





module.exports = {
    getAll,
    registrarUser,
    readUser,
    findUserByEmail
}
const db = require('../dbConfig').promise();

//Consulta para AÑADIR un usuario
const registrarUser = ({username, fullname, email, password, rol}) =>{
    return db.query('INSERT INTO users (username, fullname, email, password, rol) VALUES (?,?,?,?,?)', 
    [username, fullname, email, password, rol]);
};

//Consulta para LEER un usuario
const readUser = (id) => {
    return db.query('SELECT * FROM users WHERE id_user = ?', [id]);
}

//Consulta para BUSCAR un usuario por email
const findUserByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
}


module.exports = {
    registrarUser,
    readUser,
    findUserByEmail
}
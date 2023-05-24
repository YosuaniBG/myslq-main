const db = require('../database/dbConfig').promise();

//Consulta para AÑADIR un usuario
const registrarUser = ({username, fullname, email, password, rol}) =>{
    return db.query('INSERT INTO users (username, fullname, email, password, rol) VALUES (?,?,?,?,?)', 
    [username, fullname, email, password, rol]);
};


//Consulta para BUSCAR un usuario por email
const getUserByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
}


module.exports = {
    registrarUser,
    getUserByEmail
}
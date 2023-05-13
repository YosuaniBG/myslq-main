const db = require('../dbConfig').promise();

//Consulta para obtner lista de usuarios
const getAll = () => {
    return db.query('SELECT * FROM users');
}


const updateStudent = (id, {username, fullname, email, password, image, phone, location, subjects}) => {
    return db.query('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', 
    [username, fullname, email, password, image, phone, location, subjects, id]);
}





module.exports = {
    getAll,
}
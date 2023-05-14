const db = require('../dbConfig').promise();

//Consulta para obtner lista de usuarios
const getOneUser = (id) => {
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





module.exports = {
    getUsers,
    getOneUser,
    createAdmin,
    updateAdmin,
    updateUserStatus
}
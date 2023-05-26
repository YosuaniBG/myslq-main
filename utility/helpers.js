const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

//Método para generar el token del ususario
const generateToken = (user) => {
    const payload = {
        user_id: user.id_user,
        user_rol: user.rol,
        expires_at: dayjs().add(60,'minutes').unix()
    }

    return jwt.sign(payload, process.env.JWT_SECRET);
}

//Método para determinar de una lista de profesores si entre sus materias incluye la que se solicita por parámetro
const filterSubject = (array, subject) => {
    let result = [];
    for (let elem of array){
        let include = JSON.parse(elem.subjects).includes(subject)
       
        if(include){
            result.push(elem);
        }       
    }
    return result;
}


module.exports = {
    generateToken,
    filterSubject
}



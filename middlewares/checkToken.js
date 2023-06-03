const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/userModel');

// Middleware para chequear que el ususario que accede tenga un token válido
const checkToken = async (req, res, next) => {

    if(!req.headers['Authorization']){
        return res.status(500).json({ msg: 'Debe incluirse la cabecera Authorization'});
    }

    const token = req.headers['Authorization'];

    let obj;
    try{
        obj = jwt.verify(token, process.env.JWT_SECRET)
    }catch(error){
        return res.status(500).json({ msg: error.message});
    }

    const [user] =  await getUserById(obj.user_id);
    delete user[0].password;
    req.user = user[0];
    
    next();
}

module.exports = {
    checkToken,
}
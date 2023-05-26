const { registrarUser, getUserByEmail } = require("../models/authModel")
const bcryptjs = require('bcryptjs')
const { generateToken } = require("../utility/helpers")
const { getUserById } = require("../models/userModel")


// Registrar un usuario
const register = async (req, res) => {
  try {
    req.body.password = bcryptjs.hashSync(req.body.password, 10); 
    const [data] = await registrarUser(req.body);
    const [user] = await getUserById(data.insertId); //TODO mantener la consistencia en todas estas variables, usar una mas general

    res.status(200).send({
      msg: 'Su registro ha sido satisfactorio',
      token: generateToken(user[0])
    })
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}


// login de un usuario
const login = async (req, res) => {
  const { email, password } = req.body
  try {
    // verificar si el email existe
    const [user] = await getUserByEmail(email)

    if (!user[0]) {
      return res.status(404).json({
        msg: 'Email / Password no son correctos - email'
      });
    }

    // verificar  el usuario esta activo
    if (user[0].status === 0) {
      return res.status(404).json({
        msg: 'Usuario deshabilitado - status: false'
      });
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user[0].password);
    if (!validPassword) {
      return res.status(404).json({
        msg: 'Email / Password no son correctos - password'
      });
    }

    // Generar el Token si todo va bien
    res.status(200).json({
      msg: `Bienvenido/a ${user[0].fullname}`,
      token: generateToken(user[0])
    })
  } catch (error) {
    res.status(500).json({msg: error.message});
  }

}


module.exports = {
  register,
  login
}

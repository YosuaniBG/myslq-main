const { encrypt, compare } = require("../middlewares/handlePassword")
const { tokenSign } = require("../middlewares/handlejwt")
const { registrarUser, getUserByEmail } = require("../models/authModel")
const bcryptjs = require('bcryptjs')
const { generarJWT } = require("../middlewares/generate")
const { getUserById } = require("../models/userModel")


// Registrar un usuario
const register = async (req, res) => {
  try {
    req.body.password = await encrypt(req.body.password)    
    const [data] = await registrarUser(req.body);
    const [dataUser] = await getUserById(data.insertId); //TODO mantener la consistencia en todas estas variables, usar una mas general

    res.status(200).send({
      token: await tokenSign(dataUser[0]),
      user: dataUser[0]
    })
  } catch (error) {
    res.status(500).json({
      msg: error.message
    });
  }
}




// login
const login = async (req, res) => {
  const { email, password } = req.body
  try {
    // verificar si el email existe
    const [usuario] = await getUserByEmail(email)

    if (!usuario[0]) {
      return res.status(404).json({
        msg: 'Email / Password no son correctos'
      });
    }

    // si esta activo
    if (usuario[0].status === 0) {
      return res.status(404).json({
        msg: 'Usuario deshabilitado - status: false'
      });
    }

    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario[0].password);
    if (!validPassword) {
      return res.status(404).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    // general ej JWT
    const token = await generarJWT(usuario[0].id_user);
    delete usuario[0].password;
    res.status(200).json({
      msg: `Bienvenido ${usuario[0].fullname}`,
      user: usuario[0],
      token
    })
  } catch (error) {
    res.status(500).json({fatal: error.message});
  }

}


module.exports = {
  register,
  login
}

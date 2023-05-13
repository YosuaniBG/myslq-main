const { encrypt, compare } = require("../middlewares/handlePassword")
const { tokenSign } = require("../middlewares/handlejwt")
const { registrarUser, readUser, findUserByEmail } = require("../models/authModel")
const bcryptjs = require('bcryptjs')
const { generarJWT } = require("../middlewares/generate")


// Registrar un usuario
const register = async (req, res) => {
  try {
    req.body.password = await encrypt(req.body.password)    
    const [data] = await registrarUser(req.body);
    console.log(data);
    const [dataUser] = await readUser(data.insertId);
    

    res.send({
      token: await tokenSign(dataUser[0]),
      user: dataUser[0]
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message
    });
  }
}




// login
const login = async (req, res) => {
  const { email, password } = req.body
  try {
    // verificar si el email existe
    const [usuario] = await findUserByEmail(email)

    if (!usuario[0]) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos'
      });
    }

    // si esta activo
    if (usuario[0].rol === "alumno" && usuario[0].status === 0) {
      return res.status(400).json({
        msg: 'Usuario deshabilitado - status: false'
      });
    }
    
    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario[0].password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    // general ej JWT
    const token = await generarJWT(usuario[0].id_user);
    res.json({
      msg: "Bienvenido",
      user: usuario[0],
      token
    })
  } catch (error) {
    res.json({fatal: error.message});
  }

}


module.exports = {
  register,
  login
}

const bcryptjs = require('bcryptjs');
const { getUsers, updateAdmin, updateUserStatus, getUserById, insertAdmin, updatePassword, admission } = require("../models/userModel");


// Manejador para obtener los datos del usuario registrado y sus profesores
const adminDashboard = async (req, res) => {
  try {
    res.send({
      admin: req.user,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para obtener los datos de un usuario con rol ADMINISTRADOR a partir de su id
const OneAdmin = async (req, res) => {
  try {
    const [data] = await getUserById(req.params.id);

    // Verifica que la consulta haya devuelto algún valor que coincida
    if (!data[0]) {
      return res.status(404).json({
        msg: "El usuario no existe",
      });  
    }

    // Verifica que el id del usuario por parametro corresponda a un administrador
    if (data[0].rol !== "administrador") {
      return res.status(500).json({
        id_user: data[0].id_user,
        msg: "Este usuario no tiene permisos de administrador",
      });
    } else {
      res.send({
        user: data[0],
      });
    }

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador que permite mostar un listado de todos los usuarios con un rol determinado
const AllUsersByRole = (rol) => {
  return async (req, res) => {
    try {
      const [data] = await getUsers(rol);
  
      res.send({
        users: data,
      });

    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
}

// Manejador para registrar un nuevo ADMINISTRADOR
const newAdmin = async (req, res) => {
  try {
    req.body.password = bcryptjs.hashSync(req.body.password, 10); 
    const [data] = await insertAdmin(req.body);
    const [dataUser] = await getUserById(data.insertId);

    res.send({
      user: dataUser[0]
    })

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para actualizar los datos de otro Administrador 
const updateAdminData = async (req, res) => {
  try {
    const [data] = await updateAdmin(req.params.id, req.body);

    // Verifica que al ejecutarse la UPDATE, si esta afecta una fila es porque ese id corresponde a un Administrador
    if(data.affectedRows === 0){
      return res.status(500).send({
        msg: 'No existe ningún administrador con este id'
      })
    }

    res.send({
      msg: 'Actualización satisfactoria',
      userUpdated: data
    })

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para gestionar la contraseña del administrador loggeado
// Manejador común
const managePassword = async (req, res) => {
  try {
    const [userlogged] = await getUserById(req.user.id_user)

    const validPassword = bcryptjs.compareSync(req.body.oldPassword, userlogged[0].password);
    if (!validPassword) {
      return res.status(404).json({
        msg: 'El password antiguo no es correcto'
      });
    }

    const newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
    const [data] = await updatePassword(userlogged[0].id_user, newPassword);

    res.send({
      msg:'Password actualizado',
      userUpdated: data,
    });

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};

// Manejador para dar de ALTA o BAJA a un usuario conmutando el campo STATUS
const switchStatus = (rol) => {
  return async (req, res) => {
    try {
      let status = 0;
      let message = 'Usuario deshabilitado';
      const [dataUser] = await getUserById(req.params.id);

      // Este Verificador se encarga de comprobar que el user que estoy dando de ALTA o BAJA corresponda con el de la ruta
      if(dataUser[0].rol !== rol){
        return res.status(500).json({
          msg: `Este usuario no es ${rol}`,
        });
      }
     
      if(dataUser[0].status == 0){
        status = 1;
        message = 'Usuario habilitado';
      }
  
      const [data] = await updateUserStatus(req.params.id, rol, status);
  
      res.send({
        msg: message,
        userUpdated: data
      })
  
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  };
}

// Manejador para ACTIVAR a un nuevo profesor que se haya inscrito
const admissionTeacher = async (req, res) => {
  try {
    const [data] = await admission(req.params.id);

    // Verifica si se ejecutó alguna modificación en la fila coincidente
    if(data.changedRows === 1){
      res.send({
        msg:'Profesor admitido',
        userUpdated: data,
      });
    }else{
      res.send({
        msg:'No se encontraron coincidencias / Ya ha sido admitido'
      });
    }
    

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};


module.exports = {
  adminDashboard,
  OneAdmin,
  AllUsersByRole,
  newAdmin,
  updateAdminData,
  managePassword,
  switchStatus,
  admissionTeacher
};
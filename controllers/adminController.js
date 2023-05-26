const bcryptjs = require('bcryptjs');
const { getUsers, updateAdmin, updateUserStatus, getUserById, insertAdmin, updatePassword, admission } = require("../models/userModel");

const OneAdmin = async (req, res) => {
  try {
    const [data] = await getUserById(req.params.id);

    if (!data[0]) {
      return res.status(404).json({
        msg: "El usuario no existe",
      });  
    }

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

const updateAdminData = async (req, res) => {
  try {
    const [data] = await updateAdmin(req.params.id, req.body);

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

const managePassword = async (req, res) => {
  try {
    const password = bcryptjs.hashSync(req.body.password, 10);
    const [data] = await updatePassword(req.user.id_user, password);

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

const switchStatus = (rol) => {
  return async (req, res) => {
    try {
      let status = 0;
      let message = 'Usuario deshabilitado';
      const [dataUser] = await getUserById(req.params.id);

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

const admissionTeacher = async (req, res) => {
  try {
    const [data] = await admission(req.params.id);

    if(data.changedRows === 1){
      res.send({
        msg:'Profesor admitido',
        userUpdated: data,
      });
    }else{
      res.send({
        msg:'No se encontraron coincidencias / Ya ha sido admmitido'
      });
    }
    

  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};


module.exports = {
  OneAdmin,
  AllUsersByRole,
  newAdmin,
  updateAdminData,
  managePassword,
  switchStatus,
  admissionTeacher
};
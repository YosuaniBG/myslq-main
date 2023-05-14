const { getOneUser, getUsers, createAdmin, updateAdmin, updateUserStatus } = require("../models/userModel");
const { readUser } = require("../models/authModel");

const getOneAdmin = async (req, res) => {
  try {
    const [data] = await getOneUser(req.params.id);

    if (!data[0]) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }

    if (data[0].rol !== "administrador") {
      return res.status(400).json({
        id_user: data[0].id_user,
        msg: "Este usuario no tiene permisos de administrador",
      });
    } else {
      res.send({
        user: data[0],
      });
    }
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const getAllUsersByRole = async (req, res, rol) => {
  try {
    const [data] = await getUsers(rol);

    res.send({
      users: data,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const newAdmin = async (req, res) => {
  try {
    const [data] = await createAdmin(req.body);
    const [dataUser] = await readUser(data.insertId);

    res.send({
      user: dataUser[0]
    })

  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const updateAdminData = async (req, res) => {
  try {
    const [data] = await updateAdmin(req.params.id, req.body);

    res.send({
      userUpdated: data
    })

  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

const switchStatus = async (req, res, rol) => {
  try {
    let status = 0;
    const [dataUser] = await readUser(req.params.id);
   
    if(dataUser[0].status == 0){
      status = 1;
    }

    const [data] = await updateUserStatus(req.params.id, rol, status);

    res.send({
      userUpdated: data
    })

  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};


module.exports = {
  getOneAdmin,
  getAllUsersByRole,
  newAdmin,
  updateAdminData,
  switchStatus
};

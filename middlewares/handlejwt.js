const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


//firmando token
const tokenSign = async (user) => {
  const sign = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  return sign
};


//verificando token
const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET)
  } catch (e) {
    console.log(e);
    return null
  }
  
};

module.exports = { tokenSign, verifyToken };
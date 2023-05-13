const jwt = require('jsonwebtoken');

const generarJWT = (id_user ) => {

    return new Promise((resolve, reject) => {

        const payload = { id_user };

        // firmando jwt
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {

            if (err) {
                // console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })

    })
}




module.exports = {
    generarJWT
}


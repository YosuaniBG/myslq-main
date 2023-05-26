const express = require('express');
const cors = require('cors');
const { checkToken } = require('../middlewares/checkToken');
const { checkRole } = require('../middlewares/checkRol');


class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            admin:     '/api/admin',
            student:     '/api/student',
            teacher:     '/api/teacher'   
        }

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

  

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    //Definición de rutas principales de la API
    routes() {

        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.admin, checkToken, checkRole('administrador'), require('../routes/admin'));
        this.app.use( this.paths.student, checkToken, checkRole('alumno'), require('../routes/student'));
        this.app.use( this.paths.teacher, checkToken, checkRole('profesor'), require('../routes/teacher'));
        this.app.use( (req, res, next) => {
            res.status(404).json({
                msg: 'Ruta no encontrada...'
            })
        });

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;

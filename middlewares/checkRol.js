
const checkRole = (role) => {
    return ( req, res , next ) => {

        if ( !req.user ) {
            return res.status(500).json({
                msg: 'Peligro: Se esta intentando acceder un autorización'
            });
        }
        
        if(req.user.rol !== role){
            return res.status(500).json({
                msg: `Esta sección es solo para ${role}`
            });
        }
    
        next();
    }
}


module.exports = {
    checkRole
}
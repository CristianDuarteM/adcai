const jwt = require("jsonwebtoken");

const generarJWT = (id = "") => {
    return new Promise((resolve, reject) => {
        const paylodad = {id};
        jwt.sign(paylodad, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "1h"
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject("No se pudo generar el token");
            } else {
                resolve(token);
            }
        });
    });
    
};

module.exports = {
    generarJWT
}
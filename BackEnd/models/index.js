const Rol = require("./rol.model");
const Usuario = require("./usuario.model");
const Facultad = require("./Facultad.model");
const Departamento = require("./departamento.model");
const Usuario_rol = require("./usuario_rol.model");

Usuario.belongsToMany(Rol, {
    through: "usuario_rol",
    foreignKey: "id_usuario"
});
Rol.belongsToMany(Usuario, {
    through: "usuario_rol",
    foreignKey: "id_rol",
});

Departamento.hasMany(Usuario, {
    foreignKey: "id_departamento"
});
Usuario.belongsTo(Departamento, {
    foreignKey: "id_departamento"
});

Facultad.hasMany(Departamento, {
    foreignKey: "id_facultad"
});
Departamento.belongsTo(Facultad, {
    foreignKey: "id_facultad"
});

module.exports = {
    Rol,
    Usuario,
    Facultad,
    Departamento,
    Usuario_rol
};


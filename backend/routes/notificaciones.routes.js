const {Router} = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos.middleware");
const { validarJwt } = require("../middlewares/validar-jwt");
const { noExisteUsuarioById } = require("../helpers/db-validators");

const { listarNotificacionesByUsuario, marcarNotificacionLeida } = require("../controllers/notificaciones.controller");

const router = Router();

router.get("/:id", [
    validarJwt,
    check("id").custom(noExisteUsuarioById),
    check("rol", "Debe indicarme el rol").notEmpty(),
    check("rol", "El valor enviado no es valido").isIn(["DOCENTE", "DIRECTOR", "DECANO"]),
    validarCampos
], listarNotificacionesByUsuario);

router.put("/:id", [
    validarJwt,
    check("id").custom(noExisteUsuarioById),
    validarCampos
], marcarNotificacionLeida);

module.exports = router;
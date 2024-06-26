const {Router} = require("express");
const { check } = require("express-validator");

const { validarJwt } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos.middleware");
const { noExistePeriodo, noExisteDepartamentoById } = require("../helpers/db-validators");

const { registrarPeriodo,
        actualizarPeriodo,
        listarPeriodos,
        eliminarPeriodo, 
        buscarPeriodoById,
        buscarPeriodoByDepartamento} = require("../controllers/periodos.controller");

const router = Router();

router.get("/", [
    validarJwt
], listarPeriodos);

router.get("/:id", [
    validarJwt,
    check("id", "Debe ingresar un id valido").isInt(),
    check("id").custom(noExistePeriodo),
    validarCampos
], buscarPeriodoById);

router.get("/departamento/:id", [
    validarJwt,
    check("id", "Debe ingresar un id valido").isInt(),
    check("id").custom(noExisteDepartamentoById),
    validarCampos
], buscarPeriodoByDepartamento);

router.post("/", [
    validarJwt,
    check("inicio", "El inicio es obligatorio").notEmpty(),
    check("limite", "El limite es obligatorio").notEmpty(),
    validarCampos
], registrarPeriodo);

router.put("/:id", [
    validarJwt,
    check("id", "Debe ingresar un id valido").isInt(),
    check("id").custom(noExistePeriodo),
    check("limite", "El limite es obligatorio").notEmpty(),
    validarCampos
], actualizarPeriodo);

router.delete("/:id", [
    validarJwt,
    check("id", "Debe ingresar un id valido").isInt(),
    check("id").custom(noExistePeriodo),
    validarCampos
], eliminarPeriodo);

module.exports = router;
// USER ROUTES (AUTH)
// host + /api/auth
// noinspection SpellCheckingInspection

const express = require('express');
const { check } = require('express-validator');
const { createUser, logInUser, reValidateToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJwt} = require("../middlewares/validar-jwt");
const router = express.Router();

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'debe ser un email').isEmail(),
        check('password', 'Password debe ser 6 caracteres').isLength({ min: 6 }),
        //custom middleware
        validarCampos
    ],
    createUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    logInUser
);

router.get('/renew',validarJwt, reValidateToken);


module.exports = router;
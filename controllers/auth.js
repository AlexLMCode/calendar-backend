const {request, response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {generateJWT} = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {

    const {email, password} = req.body;

    try {

        let usuario = await User.findOne({email: email})

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }

        usuario = new User(req.body);

        //Encrypt password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save();

        //Generate JWT
        const token = await generateJWT(usuario.id, usuario.name);

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }

};

const logInUser = async (req = request, res = response) => {

    const {email, password} = req.body;

    try {

        const usuario = await User.findOne({email: email})

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese email'
            })
        }

        //Confirm passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        //Generate JWT
        const token = await generateJWT(usuario.id, usuario.name);

        return res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }

}

const reValidateToken = async (req = request, res = response) => {

    const uid = req.uid;
    const name = req.name;

    //create a new jwt and return it on this request
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        uid: uid,
        name: name,
        token: token
    });

}

module.exports = {createUser, logInUser, reValidateToken}
const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apicontroller');
const UserController = require('../controllers/usercontroller');
const EmailService = require('../services/email.service');
const AuthService = require('../services/auth.service');
const { check, validationResult, buildCheckFunction } = require('express-validator');


router.get('/getdollarblue', ApiController.getDollarBlue);
// router.post('/subscribe', ApiController.saveUserData);

router.post('/subscribe', [
    check('email').not().isEmpty().withMessage('El email no puede estar vacio'),
], async (req, res, next) => { 
    const errors = validationResult(req).array();
    if(errors!= '') {
        return res.status(422).jsonp(errors);
    } else {
        try {   
            await ApiController.saveUserData(req, res);
            //Aqui hacer el envio del email para la confirmacion su identidad (soy owner del email que use para subscribir)
            const email = await EmailService.sendEmail(req.body.email);
            if(email)
                req.flash('success_msg', 'Hemos enviado un email para verificar su identidad. Clickee en el link para poder comenzar a utilizar el servicio');
            else
                req.flash('fatal_msg', 'El email de confirmacion de cuenta no ha podido ser enviado.');
            res.render('login');

            // return res.status(200).jsonp('success');
        }

        catch(error) {
            throw new Error("Error al actualizar usuario"); 
        }
    };
});

router.post('/login', UserController.login)
router.post('/request-password', UserController.requestPassword)
router.put('/reset-password/:token', UserController.resetPassword)

// *** JWT token needed ***
// for ADMIN role
router.post('/register', UserController.register)
router.put('/switch-activated/:user_id', AuthService.authenticateJWT_forADMIN, UserController.swithActivated)
router.get('/list', AuthService.authenticateJWT_forADMIN, UserController.list)
// for any role
router.post('/change-password', AuthService.authenticateJWT, UserController.changePassword)
router.post('/edit-name', AuthService.authenticateJWT, UserController.editName)

router.get('', )

module.exports = router
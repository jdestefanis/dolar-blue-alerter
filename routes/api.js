const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apicontroller');
const { check, validationResult, buildCheckFunction } = require('express-validator');


router.get('/getdollarblue', ApiController.getDollarBlue);
// router.post('/subscribe', ApiController.saveUserData);

router.get('', )
router.post('/subscribe', [
    check('email').not().isEmpty().withMessage('El email no puede estar vacio'),
], async (req, res, next) => { 
    const errors = validationResult(req).array();
    if(errors!= '') {
        return res.status(422).jsonp(errors);
    } else {
        try {   
            await ApiController.saveUserData(req.body);
            // return res.status(200).jsonp('success');
        }

        catch(error) {
            throw new Error("Error al actualizar usuario"); 
        }
    };
});

module.exports = router
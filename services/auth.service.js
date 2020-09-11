const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticateJWT,
    authenticateJWT_forADMIN
}
   
async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SEED_AUTENTICACION, (err, response) => {
            if (err) {
            return res.status(403).json({
                ok: false,
                err: err
            })
            }
            req.user = response.user;
            next();
        });
    } else {
        return res.status(401).json({
            ok: false,
            err: 'unauthorized'
        })
    }
}

async function authenticateJWT_forADMIN(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SEED_AUTENTICACION, (err, response) => {
            if (err) {
            return res.status(403).json({
                ok: false,
                err: err
            })
            }
            if (response.user.role != 'ADMIN') {
            return res.status(403).json({
                ok: false,
                err: 'bad permissions'
            })
            }
            req.user = response.user;
            next();
        });
    } else {
        return res.status(401).json({
            ok: false,
            err: 'unauthorized'
        })
    }
}
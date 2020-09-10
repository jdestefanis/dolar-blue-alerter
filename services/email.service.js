var nodemailer = require('nodemailer');
const config = require('../config');
const request = require('request');
const service = require('../services/tokens');


//Usamos SendGrid o Gmail - Se configura desde el config.js
exports.sendEmail = async function (email) {
    if (config.sendEmail == true) {
        const emailToken = service.createEmailToken(email);
        const urlActivate = config.confirmationEmailUrl + emailToken;

        if (config.emailProvider == 'gmail') {
            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                    user: config.user,
                    pass: config.gmailAuth
                }
            });

            const mailOptions = {
                name : email,
                from: config.from,
                to: email,
                subject: config.activationEmailSubject,
                text: 'Hello ' + email + '! ?',
                html: '</br>Please click this link to confirm your email: <a href="' + urlActivate + '">Confirma tu cuenta</a>'// plain text body
            };

            transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                console.log(err);
                return false;
            }	
            else
                console.log(info);
            });

        } else if (config.emailProvider == 'sendgrid') {
            request.post(config.emailHost, {
                json: {
                    name : email,
                    email : email,
                    subject: config.activationEmailSubject,
                    text: 'Hola! ' + email + 'como estas?',
                    html: '</br>Please click this link to confirm your email: <a href="' + urlActivate + '">Confirma tu cuenta</a>',
                }
            }, (error) => {
                if (error) {
                    console.error(error);
                    return false;
                }
            });
        } else {
            console.log('El servicio de email configurado es inválido!');
            return false;
        }
    } else {
        console.log('El servicio de email esta apagado.');
        return false;
    }
    return true;
}
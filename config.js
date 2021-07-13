var config = {};

// Node App
config.nodeHttpsAppPort = 3003;
config.nodeHttpAppPort = 8082;
config.nodeApiUrl = 'http://localhost'

config.emailHost = 'https://api.redpointsmart.com/email/subscribe';
config.confirmationEmailUrl = 'https://api.redpointsmart.com/users/confirmation/';
// config.confirmationEmailUrl = 'http://localhost:3002/users/confirmation/';
config.activationEmailSubject = 'Dolar Blue Alerter - Email Confirmation';
config.emailToken = '_ASfd324SD3_';
config.sendEmail = true;
config.gmailAuth = 'uovkmbjypasjubvf';
config.emailProvider = 'sendgrid'; //or gmail
config.user = 'info@redpointsmart.com';
config.from = '"Red Point Smart" <info@redpointsmart.com>';

//Certs

//Dev
config.certKey = './certs/javier_localhost_mac_cert/localhost-key.pem';
config.certCert = './certs/javier_localhost_mac_cert/server.crt';
config.certCa = './certs/javier_localhost_mac_cert/RootCA.pem'; //This is only for prod!!!
config.certPass = '5379'; 

//Live - Prod
// config.certKey = './certs/live/key.pem';
// config.certCert = './certs/live/redpointsmart.crt';
// config.certPass = '53795379'; //This is only for prod!!!

module.exports = config;
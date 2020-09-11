const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const mailer = require('nodemailer');
const Users = require('../models/users');
const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

module.exports = {
   register,
   login,
   list,
   changePassword,
   requestPassword,
   resetPassword,
   editName,
   swithActivated  
}

   
async function register(req, res) {
   let body = req.body;
   let { name, email, password } = body;

   // Validate email format
   if (!emailRegex.test(email)) {
      return res.status(500).json({
         ok: false,
         err: 'email invalid format'
      })
   }

   let user = new Users({
         name,
         email,
         password: password!=null ? bcrypt.hashSync(password, 10) :null,
         role : 'USER'
   });

   user.save((err, userDB) => {
         if (err) {
            return res.status(400).json({
               ok: false,
               err,
            });
         }
         return res.json({
            ok: true,
            user: userDB
         });
   })
}

async function login(req, res) {
   let { email, password } = req.body;

   Users.findOne({ email }, (erro, userDB)=>{
      if (erro) {
         return res.status(500).json({
            ok: false,
            err: erro
         })
      }
      // Verify that there is a user with the email written by the user.
      if (!userDB) {
         return res.status(400).json({
            ok: false,
            err: {
               message: "Wrong User or Password"
            }
         })
      }
      // Verify that there is activated.
      if (!userDB.activated) {
         return res.status(400).json({
            ok: false,
            err: {
               message: "User not actived"
            }
         })
      }
      // Validate that the password written by the user is the one stored in the db
      if (! bcrypt.compareSync(password, userDB.password)){
         return res.status(400).json({
            ok: false,
            err: {
               message: "Wrong User or Password"
            }
         });
      }
      // Generate the authentication token
      let token = jwt.sign({
            user: userDB,
         }, process.env.SEED_AUTENTICACION, {
         expiresIn: process.env.TOKEN_EXPIRE
      })
      return res.json({
         ok: true,
         user: userDB,
         token,
      })
   })
}

async function list(req, res) {

   Users.find({}, (err, userDB)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err: err
         })
      }
      
      return res.json({
         ok: true,
         users: userDB            
      })
   })
}

async function changePassword(req, res) {
   
   let user = req.user;
   let old_password = req.body.old_password || null
   let password = req.body.new_password || null
   
   if (!password || !old_password) {
      return res.status(500).json({
         ok: false,
         err: 'password values are required'
      })
   }
   
   Users.findOne({ _id : user._id }, (err, userDB)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err: err
         })
      }
      
      if (! bcrypt.compareSync(old_password, userDB.password)){
         return res.status(400).json({
            ok: false,
            err: {
               message: "old password does not match with current password"
            }
         });
      }

      userDB.password = bcrypt.hashSync(password, 10);
      userDB.save((err) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err: err
            })
         }

         return res.json({
            ok: true,
            users: userDB            
         })
      });
   })
}

async function requestPassword(req, res) {
   let { email } = req.body
   
   if (!email) {
      return res.status(500).json({
         ok: false,
         err: 'email values is required'
      })
   }

   let resetPasswordToken = crypto.randomBytes(20).toString('hex');
   let resetPasswordExpires = Date.now() + 3600000; //expires in an hour

   Users.findOne({ email }, (err, userDB)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err: err
         })
      }

      userDB.resetPasswordToken = resetPasswordToken;
      userDB.resetPasswordExpires = resetPasswordExpires;
      
      userDB.save((err) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err: err
            })
         }

         // FALTA LA CONFIG DE EMAIl

         let link = `http://${req.headers.host}/reset-password/${userDB.resetPasswordToken}`

         const mailOptions = {
            from: 'example@map.com',
            to: 'ezequielgonzalezt@gmail.com',
            subject: 'Reset your password',
            html: `Hi ${userDB.name} \n 
            Please click on the following link <a href="${link}">${link}</a> to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
         };

         smtp.sendMail(mailOptions, (err, info) => {
            if (!err) {
               console.log('Mail success: ' + info.response);
            } else {
               console.log('Mail err', err);
            }
            smtp.close();
         });

         return res.json({
            ok: true,
            users: userDB            
         })
      });
   })
}

async function resetPassword(req, res) {
   let { token } = req.params
   let { password } = req.body

   if (!password) {
      return res.status(500).json({
         ok: false,
         err: 'password value is required'
      })
   }

   Users.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}}, (err, userDB)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err: err
         })
      }

      if (!userDB) {
         return res.status(500).json({
            ok: false,
            err: 'token expired'
         })
      }

      userDB.password = bcrypt.hashSync(password, 10);
      userDB.resetPasswordToken = undefined;
      userDB.resetPasswordExpires = undefined;
      
      userDB.save((err) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err: err
            })
         }

         // FALTA LA CONFIG DE EMAIl

         const mailOptions = {
            from: 'example@map.com',
            to: 'ezequielgonzalezt@gmail.com',
            subject: "Your password has been changed",
            text: `Hi ${userDB.name} \n 
               This is a confirmation that the password for your account ${userDB.email} has just been changed.\n`
         };

         smtp.sendMail(mailOptions, (err, info) => {
            if (!err) {
               console.log('Mail success: ' + info.response);
            } else {
               console.log('Mail err', err);
            }
            smtp.close();
         });

         res.json({
            ok: true,
            users: userDB            
         })
      });
   })
}

async function editName(req, res) {
   let user = req.user;
   let { name } = req.body
   
   if (!name) {
      return res.status(500).json({
         ok: false,
         err: 'name values is required'
      })
   }
   
   Users.findOneAndUpdate({ _id : user._id }, { name }, (err, userDB)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err: err
         })
      }
      userDB.name = name
      
      res.json({
         ok: true,
         users: userDB            
      })
   })
}

async function swithActivated(req, res) {
   let user = req.user;
   let { user_id } = req.params
   
   Users.findOne({ _id : user_id }, (err, userDB)=>{
      if (err) {
         return res.status(500).json({
            ok: false,
            err: err
         })
      }
      userDB.activated = !userDB.activated
      
      userDB.save((err) => {
         if (err) {
            return res.status(500).json({
               ok: false,
               err: err
            })
         }

         res.json({
            ok: true,
            users: userDB            
         })
      });
   })
}
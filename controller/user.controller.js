const express = require("express");
const router=express.Router();
const bcrypt = require('bcrypt');
const usermodel=require("../models/usermodel")
const UserToken=require("../models/usertoken.model")

const Role=require("../models/role.model")
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const addUser = async (req, res) => {
    console.log("register start")
    const { username, email, password } = req.body;

    console.log("password",req.body.password)
    console.log("username",username)
    console.log("email",email)
   
    // const rolesfind=await Role.findOne({role:'user'});

   
    // bcrypt.genSalt(10)

    try {
        //bcrypt 
        const salt = await bcrypt.genSalt(10);
        console.log(salt,'salt')
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
       console.log("hiiiii")
        const user = new usermodel({
            username,
            email,
            password: hashedPassword, 
            role: roled || 'user' 
            // roles:rolesfind
        });
          
      await user.save();
    //    if u want send message uncommand

      const phoneNumber = '+919361310774'
      const message = `Thank you for registering with HungryHub -'Arun g'! We look forward to serving you delicious meals. Enjoy your experience with us!`;
      await sendSMS(message, phoneNumber);

        res.status(200).send({ 
            status: true,
            message: "User Register successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            status: false,
            message: "Failed to create user.",
            error: error.message
        });
    }
};

const client = new twilio(accountSid, authToken); 


const sendSMS = async (message, toPhoneNumber, ) => {
    try {
        const client = new twilio(accountSid, authToken);

        const sentMessage = await client.messages.create({
            body: message,
            from: process.env.TWILIO_FROM_NUMBER,
            to: '+919361310774 ',

        });
        console.log('Message sent:', sentMessage.sid);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await usermodel.findById(userId);
        if (!user) {
            res.status(404).send({
                status: false,
                message: "User not found."
            });
            return;
        }
        res.status(200).send({
            status: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: "Failed to get user details.",
            error: error.message
        });
    }
};



const GetuserDetails=async(req,res)=>{
    try{
        const user=await usermodel.find({})
   // if u want send message uncommand
        // const phoneNumber = '+919361310774'
        // const message = `Thank you for registering with HungryHub -'Arun g'! We look forward to serving you delicious meals. Enjoy your experience with us!`;
        // await sendSMS(message, phoneNumber);

        res.status(200).send(user)
    }catch(error){
      console.error(error); 
      res.status(400).send(error)
        
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email :req.body.email}).populate("roles","role");
      console.log("hththtthth")
        const {roles}=user;
         
        if (!user) {
            return res.status(400).send({
                status: false,
                message: "Email is not found"
            });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send({
                status: false,
                message: "Invalid password"
            });
        }


        //JWT Token
        const usernamed=req.body.username
        const userId = user._id; 
        const accessToken = jwt.sign({ id:user._id,isAdmin:user.isAdmin,roles: roles}, process.env.ACCESS_TOKEN, { expiresIn: '10m' });

//we can send jwt using two ways payload and cookies
  
                 //cookies method
    //     res.cookie('access_token', accessToken, {
    //         httpOnly: true,
    //         secure: true, 
    //         sameSite: 'none' 
    //     }).status(200).json({
    //         status:200,
    //        message: "Login successful",
    //        data:user
    // })


        //       or

        res.status(200).json({
            status: 200,
            message: "Login successful",
            accessToken,
            user
        });
    } catch (error) {
        console.error("aaaaaaaaaa",error); 
        res.status(500).send(error);
    }  
};



const addadmin = async (req, res) => {
    const rolesfind=await Role.find({});
    const { username, email, password } = req.body;
    // const { username, email, password, role } = req.body; old
    // const role = roles[0];

   
    bcrypt.genSalt(10)


    try {
        //bcrypt 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new usermodel({
            username,
            email,
            password: hashedPassword, 
            isAdmin:true,
            // role: roled || 'user' olf
            roles:rolesfind
        });

        await user.save();

        res.status(200).send({ 
            status: true,
            message: "Admin Register successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            status: false,
            message: "Failed to create user.",
            error: error.message
        });
    }
};


const sendEmail = async (req, res) => {
    console.log("reachred reser")
    const email=req.body.email;
    console.log(email)
    const user = await usermodel.findOne({ email:{$regex:'^'+email+'$',$options:'i'  }});
    // above this line use for if user enter uppercase make small case tp search in db

    console.log(user)
    if(!user){
            return res.status(404).send({
                status: false,
                message: "email is not in db" 
            });
        
     }
     
     const payload={
        email:user.email
     }

     const expirytime=3000;
     const Token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '10m' });
    
     const newToken=new UserToken({
        userId:user._id,
        token:Token
     })

     let mailtransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
          user: 'arunarun2gs@gmail.com',
          pass: 'ciid zkdc gbpv zrcp'
        }
      });
      let maildetails = {
        from: 'arunarun2gs@gmail.com',
        to: email,  // make sure to replace this with the actual recipient's email
        subject: 'Reset Password From HungryHub',
        html: `
          <html>
            <head>
              <style>
                .button {
                   background-color: #4CAF50; /* Green */
                  border: none;
                  color: white;
                  padding: 15px 32px;
                  text-align: center;
                  text-decoration: none;
                  display: inline-block;
                  font-size: 16px;
                  margin: 4px 2px;
                  cursor: pointer;
                }
                
              </style>
            </head>
            <body>
              <h1>Password Reset Request</h1>
              <p>${user.username}</P>
              <p>We received your request for a password reset at HungryHub. Please click the button
               below to proceed:</p>
              <a href=${process.env.LIVE_URL}/reset/${Token} class="button">Reset Password</a>
            </body>
          </html>`
      };

      mailtransporter.sendMail(maildetails, async(error, info)=>{
        if (error) {
          console.log(error);
          return  res.status(400).json({
            status: false,
            message: "email not sent ",
        });
        } 
        else {
            await newToken.save()
         console.log('Email sent: ' + info.response);

          return  res.status(200).json({
            status: true,
            message: "mail sent successful",
        });
        }

      });
      

 };
 

const resetpassword=async (req, res) => {
    const token=req.body.token
    const newPassword=req.body.newPassword
    console.log(token,"tooooken")
    console.log(newPassword,"passsssword")


    jwt.verify(token, process.env.ACCESS_TOKEN,async (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);

            return res.status(403).send({
                message: "Reset Link Is Expired"
            });
        }
        else{
            const response=decoded;
            console.log("reset-token",response)
            console.log("reset-token-of-email",response.email)

            const user = await usermodel.findOne({ email:{$regex:'^'+response.email+'$',$options:'i'  }});

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password=hashedPassword
            try{
                const updateuser=await usermodel.findByIdAndUpdate(
                    {_id:user._id},
                    {$set:user},
                    {new:true}
                    )

                    return  res.status(201).json({
                        status: true,
                        message: "password update succesfully ",
                    });

            }catch(error){
                return  res.status(400).json({
                    status: false,
                    message: "password not update succesfully,it have problem ",
                });
            }

        }
    });


}


module.exports={
    GetuserDetails,
    addUser,
    getUserById,
    login,
    addadmin,
    sendEmail,
    resetpassword
    
}
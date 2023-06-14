// env variables
require('dotenv').config();
const nodemailer=require('nodemailer');
//create connection to smtp
const transporter = nodemailer.createTransport({
    //initialize values
    service: process.env.EMAIL_SERVICE_PROVIDER,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // app password
    },
});

module.exports=transporter;
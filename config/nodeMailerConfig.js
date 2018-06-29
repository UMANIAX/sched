// const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const theKeys = require('../keys')

let mailFunc = {}

mailFunc.sendMail = function (mailTo, content, subject) {

    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // const msg = {
    //     to: mailTo,
    //     from: 'admin@sched.com',
    //     subject: subject,
    //     text: content
    // }
    // sgMail.send(msg)

    let transporter = nodemailer.createTransport({
	  host: 'smtp.sendgrid.net',
	  port: 465,
	  auth: {
	    user: 'apikey',
	    pass: theKeys.sendgrId
	  }
	})

	let mailOptions = {
	  from: 'admin@sched.com',
	  to: mailTo,
	  subject: subject,
	  text: content
	}

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response)
	  }
	})
}

module.exports = mailFunc


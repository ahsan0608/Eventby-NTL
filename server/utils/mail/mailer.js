const nodemailer = require("nodemailer");

var emailVerificationTemplate = require("../../services/mailTemplates/emailVerificationTemplate");
const eventTemplate = require("../../services/mailTemplates/eventTemplate");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "newgenbabylon@gmail.com",
    pass: "newgenbabylon123456",
  },
  secure: true,
});

async function sendMailForUserVerification(email, token) {
  const mailData = {
    from: "newgenbabylon@gmail.com",
    to: email,
    subject: "Eamil verification from eventby",
    text: "Kudos from ebenyby!",
    html: emailVerificationTemplate(token),
  };
  let mailIsSend = false;
  try {
    let info = await transporter.sendMail(mailData);
    mailIsSend = info.accepted[0] ? true : false;
  } catch (err) {
    return err;
  } finally {
    return { mailIsSend };
  }
}

async function sendEventInvitation(to, subject, body, eventId) {
  const mailTemplate = eventTemplate(body, eventId);
  const mailData = {
    from: "newgenbabylon@gmail.com",
    to: to,
    subject: subject,
    text: body,
    html: mailTemplate,
  };
  let mailIsSend = false;
  try {
    let info = await transporter.sendMail(mailData);
    mailIsSend = info.accepted[0] ? true : false;
  } catch (err) {
    return err;
  } finally {
    return { mailIsSend };
  }
}

module.exports = {
  sendMailForUserVerification,
  sendEventInvitation,
};

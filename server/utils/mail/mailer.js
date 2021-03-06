/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/utils/mail/mailer.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 6th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const nodemailer = require("nodemailer");

var emailVerificationTemplate = require("../../services/mailTemplates/emailVerificationTemplate");
const eventTemplate = require("../../services/mailTemplates/eventTemplate");
const passwordResetTemplate = require("../../services/mailTemplates/passwordResetTemplate");

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
    subject: "Email verification from eventby",
    text: "Kudos from eventby!",
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

async function sendMailForPasswordReset(email, token) {
  const mailData = {
    from: "newgenbabylon@gmail.com",
    to: email,
    subject: "Reset eventby password",
    text: "Kudos from eventby!",
    html: passwordResetTemplate(token),
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
  sendMailForPasswordReset,
};

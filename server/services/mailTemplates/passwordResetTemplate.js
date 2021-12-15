/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/services/mailTemplates/emailVerificationTemplate.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: December 15th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const keys = require("../../config/keys");

module.exports = (token) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>EventBy email verification to reset password</h3>
          <p>Please click on the given link to reset your password.</p>
          <div>
            <a href="${keys.redirectDomain}/user/reset-password/${token}">Link Here to verify!</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

const keys = require("../../config/keys");

module.exports = (token) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>EventBy email verification</h3>
          <p>Please click on the given link to active your account.</p>
          <div>
            <a href="${keys.redirectDomain}/user/activeAccount/${token}">Link Here to verify!</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

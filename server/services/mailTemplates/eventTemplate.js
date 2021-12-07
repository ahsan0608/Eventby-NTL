const keys = require("../../config/keys");

module.exports = (eventbody, eventId) => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Join the event for free!!</h3>
          <p>${eventbody}</p>
          <p>More then u imagine:</p>
          <div>
            <a href="${keys.redirectDomain}/event/details/${eventId}">Link Here to Join Now!</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

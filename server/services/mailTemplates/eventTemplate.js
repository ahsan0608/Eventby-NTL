/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/services/mailTemplates/eventTemplate.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: December 11th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

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

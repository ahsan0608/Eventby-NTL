const home = require('./home.controller');
const user = require('./user.controller');
const event = require('./event.controller');
const auth = require('./auth.controller');

module.exports = {
    user,
    event,
    auth
};
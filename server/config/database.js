require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => {
    return mongoose.connect("mongodb+srv://ahsan:12345@eventbydemo.9r3tq.mongodb.net/eventbydemo?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
};
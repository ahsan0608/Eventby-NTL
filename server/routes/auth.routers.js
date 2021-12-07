const controllers = require('../controllers');
const router = require('express').Router();


router.get('/google', controllers.auth.get.googleProfile);

router.get('/google/callback', controllers.auth.get.googleCallback);

module.exports = router;
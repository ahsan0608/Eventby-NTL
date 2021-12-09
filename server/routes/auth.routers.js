/*
 * Filename: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server/routes/auth.routers.js
 * Path: /home/ahsan/Documents/Full Stack Node and React/Eventby/SMOOTH/dec 05th 2021/Eventby/server
 * Created Date: November 5th 2021, 2:49:48 pm
 * Author: ahsan
 *
 * Copyright (c) 2021 @BRL
 */

const controllers = require("../controllers");
const router = require("express").Router();

router.get("/google", controllers.auth.get.googleProfile);

router.get("/google/callback", controllers.auth.get.googleCallback);

module.exports = router;

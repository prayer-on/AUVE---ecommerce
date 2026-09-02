const express = require('express');
const router = express.Router();
const userController = require('../controllers/User')

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.put("/reset-password/:token", userController.resetPassword);
router.post("/launch-notify", userController.saveLaunchLead);


module.exports = router;
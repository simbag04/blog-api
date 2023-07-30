const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')

router.post('/sign-up', authController.sign_up_post);
router.post('/log-in', authController.log_in_post);

module.exports = router;
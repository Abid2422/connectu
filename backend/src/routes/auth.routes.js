const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateSignupRequest, validateOtpVerifyRequest } = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/signup', validateSignupRequest, authController.signup);
router.post('/verify-otp', validateOtpVerifyRequest, authController.verifyOtp);
router.post('/resend-otp', validateSignupRequest, authController.resendOtp);

module.exports = router;

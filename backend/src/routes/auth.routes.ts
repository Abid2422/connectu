import { Router } from 'express';
import { signup, verifyOtp, resendOtp } from '../controllers/auth.controller';
import { validateSignupRequest, validateOtpVerifyRequest } from '../middleware/validate.middleware';

const router = Router();

router.post('/signup', validateSignupRequest, signup);
router.post('/verify-otp', validateOtpVerifyRequest, verifyOtp);
router.post('/resend-otp', validateSignupRequest, resendOtp);

export default router;

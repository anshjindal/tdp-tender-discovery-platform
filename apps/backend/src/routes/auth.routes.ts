// apps/backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { signupHandler } from '../controllers/us-001/signup.controller';
import { loginHandler } from '../controllers/us-001/login.controller';
import { forgotPasswordHandler } from '../controllers/us-001/forgotPassword.controller';
import { resetPasswordHandler } from '../controllers/us-001/resetPassword.controller';

const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password', resetPasswordHandler);


export default authRouter;


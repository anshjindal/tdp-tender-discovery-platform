// apps/backend/src/routes/auth.routes.ts
import { Router } from 'express';

import {signupHandler,loginHandler, resetPasswordHandler, forgotPasswordHandler, getAccount,testEmail} from '../controllers/us-001/user_controller'
// import { auth } from '../middleware/auth.middleware';

const authRouter: Router = Router(); 

authRouter.post('/signup', signupHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/forgotpassword', forgotPasswordHandler);
authRouter.post('/resetpassword', resetPasswordHandler);
authRouter.post('/test-email', testEmail);
authRouter.get('/account',getAccount)


export default authRouter;


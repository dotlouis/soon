import express from 'express';
// import getCurrent from './auth.signup';
import login from './auth.login';
import signup from './auth.signup';

let authRouter = express.Router();

// authRouter.route('/me')
// .get(getCurrent);

authRouter.route('/login')
.post(login);

authRouter.route('/signup')
.post(signup);

export default authRouter;

import express from 'express';
import stormpath from 'express-stormpath';
import * as ENV from '../env';
import apiRouter from '../api/api.router';
import authRouter from '../auth/auth.router';

let mainRouter = express.Router();
// Mount the api
mainRouter.use('/', authRouter);
mainRouter.use(ENV.API_PATH, stormpath.apiAuthenticationRequired, apiRouter);
// Unknown endpoints redirect to api root
mainRouter.all('/*', (req,res)=>{
	res.redirect(ENV.API_PATH);
});

export default mainRouter;

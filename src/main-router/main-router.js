import express from 'express';
import * as ENV from '../env';
import apiRouter from '../api-router/api-router';

let mainRouter = express.Router();
// Mount the api
mainRouter.use(ENV.API_PATH, apiRouter);
// Unknown endpoints redirect to api root
mainRouter.all('/*', (req,res)=>{
	res.redirect(ENV.API_PATH);
});

export default mainRouter;

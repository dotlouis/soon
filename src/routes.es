import express from 'express';
import * as ENV from './env';
import userRouter from './user/user.controller';

// CAUTION: order is important
// precises routes first, global routes last

let apiRouter = express.Router();
// Mount models routes
apiRouter.use('/user', userRouter);
// Root API
apiRouter.all('/', (req,res)=>{
	res.send('Welcome to the API server');
});

let mainRouter = express.Router();
// Mount the api
mainRouter.use(ENV.API_PATH, apiRouter);
// Unknown endpoints redirect to api root
mainRouter.all('/*', (req,res)=>{
	res.redirect(ENV.API_PATH);
});

export default mainRouter;

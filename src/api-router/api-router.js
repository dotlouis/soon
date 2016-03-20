import express from 'express';
import {NotFound} from '../errors/errors';
import eventRouter from '../event/event.controller';

// CAUTION: order is important
// precises routes first, global routes last

let apiRouter = express.Router();
// Mount models routes
apiRouter.use('/events', eventRouter);
// Root API
apiRouter.all('/', (req,res)=>{
	res.send('Welcome to the API server');
});
// Other routes
apiRouter.all('/*', (req,res)=>{
	throw new NotFound();
});

export default apiRouter;

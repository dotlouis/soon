import express from 'express';
import eventRouter from '../event/event.controller';
import chainRouter from '../chain/chain.controller';

// CAUTION: order is important
// precises routes first, global routes last

let apiRouter = express.Router();
// Mount models routes
apiRouter.use('/events', eventRouter);
// Root API
apiRouter.all('/', (req,res)=>{
	res.send('Welcome to the API server');
});

export default apiRouter;

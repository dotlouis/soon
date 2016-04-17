import express from 'express';
import stormpathInit from './stormpath/stormpath';
import bodyParser from 'body-parser';
import log,{requestLogger, errorLogger} from './logger/logger';
import errorHandler,{shutdownOnError} from './error-handler/error-handler';
import * as ENV from './env';
import mongoose from './mongoose/mongoose'; // must import before models (router)
import mainRouter from './main-router/main-router';

// create the express app
const app = express();

// middlewares (order matters)
app.use(requestLogger);
app.use(bodyParser.json());
app.use(stormpathInit(app));
app.use(mainRouter);

// error handlers (order matters)
app.use(errorHandler);
app.use(errorLogger);
app.use(shutdownOnError);

// listen incoming connections
app.on('stormpath.ready', async()=>{
	try{
		let server = await app.listen(ENV.APP_PORT);
		let {address,port} = server.address();
		log.info(`API available at http://${address}:${port}${ENV.API_PATH}`);
	}
	catch(err){
		log.fatal(err);
	}
});

export default app;

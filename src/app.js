import express from 'express';
import log,{requestLogger} from './logger/logger';
import * as ENV from './env';
import router from './routes';

// create the express app
const app = express();

// use middlewares
app.use(requestLogger);
app.use(router);

// listen incoming connections
(async()=>{
	try{
		let server = await app.listen(ENV.APP_PORT);
		let host = server.address().address;
		let port = server.address().port;
		log.info(`API available at http://${host}:${port}${ENV.API_PATH}`);
	}
	catch(err){
 		log.fatal(err);
	}
})();

export default app;

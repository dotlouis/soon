import express from 'express';
import bodyParser from 'body-parser';
import log,{requestLogger} from './logger/logger';
import * as ENV from './env';
import router from './routes';

// create the express app
const app = express();

// use middlewares
app.use(bodyParser.json());
app.use(requestLogger);
app.use(router);

// listen incoming connections
(async()=>{
	try{
		let server = await app.listen(ENV.APP_PORT);
		let {address,port} = server.address();
		log.info(`API available at http://${address}:${port}${ENV.API_PATH}`);
	}
	catch(err){
		log.fatal(err);
	}
})();

export default app;

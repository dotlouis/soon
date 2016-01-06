import express from 'express';
import router from './routes';
import * as ENV from './env';

// create the express app
export const app = express();

// use middlewares
app.use(router);

// listen incoming connections
(async()=>{
	try{
		let server = await app.listen(ENV.APP_PORT);
		let host = server.address().address;
		let port = server.address().port;
		console.log(`API available at http://${host}:${port}${ENV.API_PATH}`);
	}
	catch(err){
 		console.log(err);
	}
})();

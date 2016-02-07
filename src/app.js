import express from 'express';
import * as ENV from './env';
import router from './routes';

// create the express app
const app = express();

// use middlewares
app.use(router);

// listen incoming connections
(async()=>{
	try{
		let server = await app.listen(ENV.APP_PORT);
		let host = server.address().address;
		let port = server.address().port;
	}
	catch(err){
	}
})();

export default app;

import bluebird from 'bluebird';
import {BadRequest} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let app = req.app.get('stormpathApplication');
		let account = bluebird.promisifyAll(await app.createAccountAsync(req.body));
		let apiKey = await account.createApiKeyAsync();

		res.json({account,apiKey});
	}
	catch(err){
		if(err.name == 'ResourceError')
			if(err.status < 500 && err.status >= 400)
				throw BadRequest(err);
		throw err;
	}
});

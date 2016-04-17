import bluebird from 'bluebird';
import {BadRequest} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let app = req.app.get('stormpathApplication');
		let authResult = bluebird.promisifyAll(await app.authenticateAccountAsync(req.body));
		let account = await authResult.getAccountAsync({expand: 'apiKeys'});
		res.json(account);
	}
	catch(err){
		if(err.name == 'ResourceError')
			if(err.status < 500 && err.status >= 400)
				throw BadRequest(err);
		throw err;
	}
});

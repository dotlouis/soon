import Topic from './topic.model';
import {BadRequest, NotFound} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let topic = await Topic.findByIdAndRemove(req.params.id).exec();
		if(!topic)
			throw new NotFound();

		res.sendStatus(200);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
				throw new BadRequest(err);
				break;
			default:
				throw err;
		}
	}
});

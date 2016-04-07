import Topic from './topic.model';
import {BadRequest, NotFound} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let topic = new Topic();

		await topic.save();
		res.json(topic);
	}
	catch(err){
		switch(err.name){
			default:
				throw err;
		}
	}
});

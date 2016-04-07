import Topic from './topic.model';
import Event from '../event/event.model';
import {BadRequest, NotFound} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let topic = await Topic.findById(req.params.id).exec();
		if(!topic)
			throw new NotFound();

		let events = await Event.find({ topic: topic.id }).exec();

		res.json(events);
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

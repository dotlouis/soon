import Topic from './topic.model';
import Event from '../event/event.model';
import {BadRequest, NotFound} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let topic = await Topic.findById(req.params.id).exec();
		if(!topic)
			throw new NotFound();

		// remove all events from that topic
		await Event.remove({ topic: topic.id }).exec();

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

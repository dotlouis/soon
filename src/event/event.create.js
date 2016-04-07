import Event from './event.model';
import Topic from '../topic/topic.model';
import {wrap} from '../utils/utils';
import {BadRequest, NotFound} from '../errors/errors';

export default wrap(async(req, res)=>{
	try{
		let topic, event;

		// create the event
		event = new Event(req.body);

		// either link to an existing topic or create a new one
		if(req.body.linkTo){
			topic = await Topic.findById(req.body.linkTo).exec();
			if(!topic)
				throw new NotFound('Cannot find topic to link the event to');
		}
		else
			topic = new Topic();

		// link the event to the topic
		event.addTo(topic);

		// once the topic and event are saved we send the event
		await event.save();
		await topic.save();
		res.json(event);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
			case 'ValidationError':
			case 'RangeError':
				throw new BadRequest(err);
				break;
			default:
				throw err;
		}
	}
});

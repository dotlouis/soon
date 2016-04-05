import Event from './event.model';
import {BadRequest, NotFound, NoContent} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let event = await Event.findById(req.params.id).exec();
		if(!event)
			throw new NotFound();

		let relatedEvents = await Event.find({
			chain: event.chain
		}).exec();

		if(relatedEvents.length === 0)
			throw new NoContent();
		res.json(relatedEvents);
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

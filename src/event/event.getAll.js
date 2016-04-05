import Event from './event.model';
import {BadRequest, NoContent} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let events = await Event.find().exec();
		if(events.length === 0)
			throw new NoContent();
		res.json(events);
	}
	catch(err){
		throw err;
	}
});

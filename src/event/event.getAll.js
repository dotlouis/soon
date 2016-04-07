import Event from './event.model';
import {BadRequest} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let events = await Event.find().exec();
		res.json(events);
	}
	catch(err){
		throw err;
	}
});

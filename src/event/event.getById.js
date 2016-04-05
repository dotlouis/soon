import Event from './event.model';
import {BadRequest, NotFound} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let event = await Event.findById(req.params.id).exec();
		if(!event)
			throw new NotFound();
		res.json(event);
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

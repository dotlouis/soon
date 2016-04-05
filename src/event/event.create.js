import Event from './event.model';
import Chain from '../chain/chain.model';
import {wrap} from '../utils/utils';
import {BadRequest, NotFound} from '../errors/errors';

export default wrap(async(req, res)=>{
	try{
		let chain, event;

		// create the event
		event = new Event(req.body);

		// either link to an existing chain or create a new one
		if(req.body.linkTo){
			let linkedEvent = await Event.findById(req.body.linkTo).exec();
			if(!linkedEvent)
				throw new NotFound('Cannot find event to link the event to');

			chain = await Chain.findById(linkedEvent.chain).exec();
			if(!chain)
				throw new NotFound('Cannot find chain to link the event to');
		}
		else
			chain = new Chain();

		// link the event to the chain
		event.addTo(chain);

		// once the chain and event are saved we send the event
		await Promise.all([chain.save(), event.save()]);
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

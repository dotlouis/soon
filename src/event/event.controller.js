import express from 'express';
import {BadRequest, NoContent, NotFound} from '../errors/errors';
import Event from './event.model';
import Chain from '../chain/chain.model';
import {wrap} from '../utils/utils';

let EventController = {};

EventController.getById = wrap(async(req, res)=>{
	try{
		let event = await Event.findById(req.params.id).exec();
		if(!event)
			throw new NotFound();
		res.json(event);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
				throw new BadRequest('Wrong id format');
				break;
			default:
				throw err;
		}
	}
});

EventController.deleteById = wrap(async(req, res)=>{
	try{
		let event = await Event.findByIdAndRemove(req.params.id).exec();
		if(!event)
			throw new NotFound();
		res.sendStatus(200);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
				throw new BadRequest('Wrong id format');
				break;
			default:
				throw err;
		}
	}
});

EventController.getAll = wrap(async(req, res)=>{
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

EventController.create = wrap(async(req, res)=>{
	try {
		let chain, event;

		// create the event
		event = new Event(req.body);

		// either link to an existing chain or create a new one
		if(req.body.chain){
			chain = await Chain.findById(req.body.chain).exec();
			if(!chain)
				throw new BadRequest('A chain with the given ID does not exists');
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
				throw new BadRequest('Some data is wrong format');
				break;
			default:
				throw err;
		}
	}
});
let router = express.Router();

router.route('/:id')
.get(EventController.getById)
.delete(EventController.deleteById);

router.route('/')
.get(EventController.getAll)
.post(EventController.create);

/* TODO
¨* - HEAD (check if a record exists)
 * - PUT/PATCH (update a record)
 */

export default router;

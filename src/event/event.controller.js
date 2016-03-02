import express from 'express';
import * as Err from '../errors/errors';
import Event from './event.model';
import Chain from '../chain/chain.model';
import {wrap, delay} from '../utils/utils';

let router = express.Router();

router.route('/:id')
// get by id
.get(wrap(async(req, res)=>{
	try{
		let event = await Event.findById(req.params.id).exec();
		if(!event)
			throw new Err.NotFound();
		res.json(event);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
				throw new Err.BadRequest('Wrong id format for event');
				break;
			default:
				throw err;
		}
	}
}))
// delete by id
.delete(wrap(async(req,res)=>{
	try{
		let event = await Event.findByIdAndRemove(req.params.id).exec();
		if(!event)
			throw new Err.NotFound();
		res.sendStatus(200);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
				throw new Err.BadRequest('Wrong id format for event');
				break;
			default:
				throw err;
		}
	}
}));

router.route('/')
// get all
.get(wrap(async(req, res)=>{
	try{
		let events = await Event.find().exec();
		if(events.length === 0)
			throw new Err.NoContent();
		res.json(events);
	}
	catch(err){
		throw err;
	}
}))
// create
.post(wrap(async(req, res)=>{
	try {
		let chain, event;

		// create the event
		event = new Event(req.body);

		// either link to an existing chain or create a new one
		if(req.body.chain){
			chain = await Chain.findById(req.body.chain).exec();
			if(!chain)
				throw new Err.BadRequest('A chain with the given ID does not exists');
		}
		else
			chain = new Chain();

		// link the chain to the event
		chain.add(event);
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
				throw new Err.BadRequest('Some data is wrong format');
				break;
			default:
				throw err;
		}
	}
}));

/* TODO
¨* - HEAD (check if a record exists)
 * - PUT/PATCH (update a record)
 */

export default router;

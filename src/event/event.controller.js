import express from 'express';
import {NotFoundError, NoContentError} from '../errors/errors';
import Event from './event.model';
import Chain from '../chain/chain.model';
import {wrap, delay} from '../utils/utils';

let router = express.Router();

router.route('/:id')
// get by id
.get(wrap(async(req, res)=>{
	try{
		let event = await NotFoundError.notFoundify(Event.findById(req.params.id).exec());
		res.json(event);
	}
	catch(err){
		switch(err.name){
			case 'NotFoundError':
				req.log.warn(err);
				res.sendStatus(404);
				break;
			case 'CastError':
				req.log.warn(err);
				res.status(400).send('Wrong id format');
				break;
		default:
			throw err;
		}
	}
}))
// delete by id
.delete(wrap(async(req,res)=>{
	try{
		let event = await NotFoundError.notFoundify(Event.findByIdAndRemove(req.params.id).exec());
		res.sendStatus(200);
	}
	catch(err){
		switch(err.name){
			case 'NotFoundError':
				req.log.warn(err);
				res.sendStatus(404);
				break;
			case 'CastError':
				req.log.warn(err);
				res.status(400).send('Wrong id format');
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
		let events = await NoContentError.noContentify(Event.find().exec());
		res.json(events);
	}
	catch(err){
		switch(err.name){
			case 'NoContentError':
				req.log.warn(err);
				res.sendStatus(204);
				break;
		default:
			throw err;
		}
	}
}))
// create
.post(wrap(async(req, res)=>{
	try {
		let chain, event;

		// create the event
		event = new Event(req.body);

		// either link to an existing chain or create a new one
		if(req.body.chain)
			chain = await NotFoundError.notFoundify(Chain.findById(req.body.chain).exec());
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
			case 'NotFoundError':
				req.log.warn(err);
				res.status(400).send(`Can't create Event, because a chain with the given ID does not exists`);
				break;
			case 'CastError':
				req.log.warn(err);
				res.status(400).send(`Can't create Event, because the given chain ID is a wrong format`);
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

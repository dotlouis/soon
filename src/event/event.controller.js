import express from 'express';
import Event from './event.model';
import {wrap, delay} from '../utils/utils';

let router = express.Router();

router.route('/:id')
// get by id
.get(wrap(async(req, res)=>{
	try{
		let event = await Event.findById(req.params.id).exec();
		if(!event)
			res.sendStatus(404);
		else
			res.json(event);
	}
	catch(err){
		switch(err.name){
			// wrong id format
			case 'CastError':
				req.log.warn(err);
				res.sendStatus(400);
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
			res.sendStatus(404);
		else
			res.sendStatus(200);
	}
	catch(err){
		switch(err.name){
			// wrong id format
			case 'CastError':
				req.log.warn(err);
				res.sendStatus(400);
				break;
		default:
			throw err;
		}
	}
}));

router.route('/')
// get all
.get(wrap(async(req, res)=>{
	let events = await Event.find();
	res.json(events);
}))
// create
.post(wrap(async(req, res)=>{
	try {
		let event = new Event(req.body);
		await event.save();
		res.json(event);
	}
	catch(err){
		switch(err.name){
			// wrong params format
			case 'ValidationError':
				req.log.warn(err);
				res.sendStatus(400);
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

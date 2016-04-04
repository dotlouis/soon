import express from 'express';
import range from '../range/range';
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
				throw new BadRequest(err);
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
				throw new BadRequest(err);
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

EventController.between = wrap(async(req, res)=>{
	try{
		let chains = await Event.find({
			_id: { $in: req.body.scope }
		}).distinct('chain').exec();
		if(chains.length === 0)
			throw new NotFound(`Can't find specified ids`);

		// get range from parameters
		let {start: after, end: before, duration: span} = range({
			rangeLength: 1,
			rangeUnit: 'months'
		})(req.body.after, req.body.before, req.body.span);


		let selectedEvents = [];
		let [existingEvents, recurringEvents] = await Promise.all([
			// Retreive the events in this date range
			Event.find({
				chain: { $in: chains },
				start: { '$lt': before },
				end: { '$gte': after }
			}).exec(),

			// Retreive recurring event to generate their matching occurences
			Event.find({
				chain: { $in: chains },
				rrule: { $exists: true }
			}).exec()
		]);


		// we generate events generated events on the fly
		let generatedEvents = [];
		for(let e of recurringEvents){
			generatedEvents = generatedEvents.concat(e.occur({after, before}));
		}

		// we strip out existing events from the previously
		// generated ones
		let distinctEvents = distinct(generatedEvents, existingEvents);

		// the rest (not already existing) are bulk-saved in DB
		let savedEvents = [];
		if(distinctEvents.length > 0)
			savedEvents = await Event.insertMany(distinctEvents);

		// we concat both existing and newly saved events
		let allEvents = existingEvents
		.concat(savedEvents)
		// we sort them by starting date
		.sort((a,b)=>{
			let aTime = a.start.getTime(),
				bTime = b.start.getTime();
			if(aTime < bTime) return -1;
			else if(aTime > bTime) return 1;
			else return 0;
		});

		req.log.info({
			'recurring': recurringEvents.length,
			'existing': existingEvents.length,
			'generated': generatedEvents.length,
			'saved': savedEvents.length
		});

		res.json(allEvents);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
			case 'RangeError':
				throw new BadRequest(err);
				break;
			default:
				throw err;
		}
	}
});

function distinct(generated, existing){
	let distinctEvents = [];

	for (let g of generated){
		let exists = false;
		for(let e of existing){
			// we either compare to other generatedFrom ids (for existing
			// generated events) or original ids (for existing original events)
			let id = (e.generatedFrom ? e.generatedFrom.toString(): e.id);

			// we don't include generated events if they match an existing one
			// by generatedFrom Id and start date
			if(g.generatedFrom == id && g.start.getTime() == e.start.getTime()){
				exists = true;
				break;
			}
		}
		if(!exists)
			distinctEvents.push(g);
	}
	return distinctEvents;
}

EventController.getRelated = wrap(async(req, res)=>{
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

let router = express.Router();

router.route('/:id/related')
.get(EventController.getRelated);

router.route('/:id')
.get(EventController.getById)
.delete(EventController.deleteById);

router.route('/between')
.get(EventController.between)
// some systems does not accept body parameters for GET
.post(EventController.between);

router.route('/')
.get(EventController.getAll)
.post(EventController.create);

/* TODO
¨* - HEAD (check if a record exists)
 * - PUT/PATCH (update a record)
 */

export default router;

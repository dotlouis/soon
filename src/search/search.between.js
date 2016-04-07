import range from '../range/range';
import Event from '../event/event.model';
import Topic from '../topic/topic.model';
import {BadRequest, NotFound} from '../errors/errors';
import {wrap} from '../utils/utils';

export default wrap(async(req, res)=>{
	try{
		let topics = await Topic.find({
			_id: { $in: req.body.scope }
		}).exec();
		if(topics.length === 0)
			throw new NotFound(`Can't find specified topics`);

		// get range from parameters
		let {start: after, end: before} = range({
			rangeLength: 1,
			rangeUnit: 'months'
		})(req.body.after, req.body.before, req.body.span);

		let selectedEvents = [];
		let [existingEvents, recurringEvents] = await Promise.all([
			// Retreive the events in this date range
			Event.find({
				topic: { $in: topics },
				start: { '$lt': before },
				end: { '$gte': after }
			}).exec(),

			// Retreive recurring event to generate their matching occurences
			Event.find({
				topic: { $in: topics },
				generatedFrom: { $exists: false },
				rrule: { $exists: true }
			}).exec()
		]);

		// we generate events on the fly
		let generatedEvents = [];
		for(let e of recurringEvents){
			generatedEvents = generatedEvents.concat(e.occur({after, before}));
		}

		// we strip out existing events from the generated ones
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

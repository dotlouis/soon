import moment from 'moment';
import {defaultSchema} from '../mongoose/mongoose';
import {Model, pre} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Event{

	// inherit the default mongoose schema
	static schema = Object.assign({
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		duration: { type: String, required: true }
	}, defaultSchema);

	// This method act as a constructor
	// Used to process complex params default
	static spawn(params = {}){
		let event = Object.assign({},
			computeTimes(params) // start, end, duration
		);

		// "real" constructor with params as defined in the schema
		return (new this(event));
	}
}

function computeTimes(params){
	let start, end, duration;
	start = moment(params.start) || moment();

	// end parameter take precedence over duration
	if(params.end){
		end = moment(params.end);
		duration = moment.duration(end.diff(start));
	}

	// you can specify a duration rather than an end
	else if(params.duration){
		duration = moment.duration(params.duration);
		end = moment(start).add(duration);
	}

	// if none are specified, the default event is 1h
	else{
		duration = moment.duration(1, 'h');
		end = moment(start).add(duration);
	}

	return { start, end, duration };
}

// Allows to call `new Event()` when importing this file
// Does the same thing as `Event.spawn()`
// TODO create a @construct decorator to abstract this
export default class extends Event{
	constructor(params){
		super();
		return Event.spawn(params);
	}
}

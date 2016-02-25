import moment from 'moment';
import {defaultSchema} from '../mongoose/mongoose';
import {Model, pre} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Event{

	// inherit the default mongoose schema
	static schema = Object.assign({
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		duration: { type: String }
	}, defaultSchema);

	// This method act as a constructor
	// Used to process complex params default
	static spawn(params = {}){
		let opt = {};
		opt.start = moment(params.start) || moment();

		// end parameter take precedence over duration
		if(params.end){
			opt.end = moment(params.end);
			opt.duration = moment.duration(opt.end.diff(opt.start));
		}

		// you can specify a duration rather than an end
		else if(params.duration){
			opt.duration = moment.duration(params.duration);
			opt.end = moment(opt.start).add(opt.duration);
		}

		// if none are specified, the default event is 1h
		else{
			opt.duration = moment.duration(1, 'h');
			opt.end = moment(opt.start).add(opt.duration);
		}

		// "real" constructor with params as defined in the schema
		return (new this(opt));
	}
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

import moment from 'moment';
import {ObjectId, defaultSchema} from '../mongoose/mongoose';
import {Model, pre, post} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Event{

	// inherit the default mongoose schema
	static schema = Object.assign({
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		duration: { type: String, required: true },
		chain: { type: ObjectId, ref: 'Chain', required: true }	// the chain the event is linked to
	}, defaultSchema);

	@pre('validate')
	computeTimes(next){
		let start, end, duration;
		start = moment(this.start) || moment();

		// end parameter take precedence over duration
		if(this.end){
			end = moment(this.end);
			duration = moment.duration(end.diff(start));
		}

		// you can specify a duration rather than an end
		else if(this.duration){
			duration = moment.duration(this.duration);
			end = moment(start).add(duration);
		}

		// if none are specified, the default event is 1h
		else{
			duration = moment.duration(1, 'h');
			end = moment(start).add(duration);
		}

		this.start = start;
		this.end = end;
		this.duration = duration;
		next();
	}

	addTo(chain){
		this.chain = chain._id;
	}
}

export default Event;

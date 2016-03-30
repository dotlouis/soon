import range from '../range/range';
import {BadRequest} from '../errors/errors';
import RRule from '../rrule/rrule.schema';
import {ObjectId, defaultSchema} from '../mongoose/mongoose';
import {Model, pre, post} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Event{

	// inherit the default mongoose schema
	static schema = Object.assign({
		// the chain the event is linked to
		chain: { type: ObjectId, ref: 'Chain', required: true, private: true },
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		duration: { type: String, required: true },
		// the recurrence rule to generate events from
		rrule: RRule
	}, defaultSchema);

	@pre('validate')
	computeTimes(next){
		try{
			let {start, end, duration} = range({
				rangeLength: 1,
				rangeUnit: 'hours'
			})(this.start, this.end, this.duration);

			this.start = start;
			this.end = end;
			this.duration = duration;
		}
		catch(err){
			switch(err.name){
				case 'RangeError':
					throw err;
					break;
				default:
					throw new BadRequest('Wrong start and/or end and/or duration format');
			}
		}
		next();
	}

	@pre('validate')
	computeRRuleDefault(next){
		this.rrule._dtstart = this.start;
		next();
	}

	addTo(chain){
		this.chain = chain._id;
	}
}

export default Event;

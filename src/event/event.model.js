import range from '../range/range';
import RRuleSchema from '../rrule/rrule.schema';
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
		rrule: RRuleSchema
	}, defaultSchema);

	@pre('validate')
	computeTimes(){
		let {start, end, duration} = range({
			rangeLength: 1,
			rangeUnit: 'hours'
		})(this.start, this.end, this.duration);

		this.start = start;
		this.end = end;
		this.duration = duration;
	}

	@post('validate')
	computeRRuleDefault(){
		if(this.rrule)
			this.rrule._dtstart = this.start;
	}

	addTo(chain){
		this.chain = chain._id;
	}
}

export default Event;

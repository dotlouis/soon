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
		rrule: RRuleSchema,
		// the event has been generated by a recurrence rule
		generatedFrom: { type: ObjectId, ref: 'Event', private: true }
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
			this.rrule.dtstart = this.start;
	}

	addTo(chain){
		this.chain = chain._id;
	}

	occur(between){
		if(!this.rrule)
			return;
		let occurences = [], now = Date();
		for (let o of this.rrule.generate(between)){
			// we generate the parameters to create the event occurence
			let occurence = {
				chain: this.chain,
				// the start date is the occurence date
				start: o,
				// Notice how the end parameter is not specified
				// because computed from start and duration at creation time
				duration: this.duration,
				rrule: this.rrule,
				// we add a reference to the event it was generated from
				generatedFrom: this.id,
				// timestamps are not automatically added via insertMany()
				createdAt: now,
				updatedAt: now
			};
			occurences.push(occurence);
		}
		return occurences;
	}
}

export default Event;

import range from '../range/range';
import {BadRequest} from '../errors/errors';
import {RRule, RRuleSet, rrulestr} from 'rrule';
import {ObjectId, defaultSchema} from '../mongoose/mongoose';
import {Model, pre, post} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Event{

	// inherit the default mongoose schema
	static schema = Object.assign({
		chain: { type: ObjectId, ref:'Chain', required: true, private: true },	// the chain the event is linked to
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		duration: { type: String, required: true },
		rrule: [{ type: String }],	// the recurrence rule to generate events from
		virtual: { type: Boolean }	// the event has been virtualDate by a recurrence rule
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
			throw new BadRequest('Wrong start and/or end and/or duration format');
		}
		next();
	}

	@pre('validate')
	computeRRule(next){
		let rruleSet;
		try{
			if(typeof this.rrule === 'string'){
				// we parse the string to check for errors and create a rruleset
				rruleSet = rrulestr(this.rrule, {forceset: true});
				// we convert back the rruleset to its array representation
				this.rrule = rruleSet.valueOf();
			}
		}
		catch(err){
			throw new BadRequest('Wrong rrule format');
		}
		next();
	}

	// return and persist events generated from a recurrence rule
	generateVirtuals(params = {}){
		try{
			// if no rrule we don't do anything
			if(!this.rrule || this.rrule.length === 0)
				return null;

			let self = this,
				// default range start date is now
				after = moment(),
				// default range end date is 1 month after the range start date
				before = moment(after).add(1, 'months'),
				virtualEvents = [],
				// we convert the array of rrule into its string representation
				// see https://github.com/jkbrzt/rrule#rrulestr-function
				rruleSetString = self.rrule.join('\n'),
				// we create the rruleSet object from the string
				rruleSet = rrulestr(rruleSetString, {forceset: true}),
				// the maximum number of virtual events to be created/returned
				// even if the COUNT of the RRule is greater or if the number of
				// occurences between the after and before date should generate more
				// dates (to be refined after some tests)
				MAX_VIRTUALS = 100,
				INCLUSIVE = false;

			// for each rrule in rruleset we set the dtstart and weekday
			// to the start date of the event. Therefore any original RRULE
			// dtstart and byweekday parameter will be overriden
			let weekday = moment(self.start).isoWeekday() - 1;
			for(let rrule of rruleSet._rrule){
				rrule.options.dtstart = self.start;
				rrule.options.byweekday = [ weekday ];
			}

			// if there are params, we override defaults
			if(params.after)
				after = moment(params.after);
			if(params.before)
				before = moment(params.before);

			rruleSet.between(after.toDate(), before.toDate(), INCLUSIVE, (date, i)=>{
				if(i > MAX_VIRTUALS)
					return false;

				// original event is not included because it already exist in DB
				// how convenient: https://github.com/jkbrzt/rrule/issues/84

				virtualEvents.push({
					start: date,
					// we use duration instead of end parameter
					// in case the event is more than 24 hours long
					duration: self.duration,
					rrule: self.rrule,
					chain: self.chain,
					// the virtual flag let us know the event has been
					// auto-generated from a rrule
					virtual: true
				});

				return true;
			});

			return virtualEvents;
		}
		catch(err){
			throw err;
		}
	}

	addTo(chain){
		this.chain = chain._id;
	}
}

export default Event;

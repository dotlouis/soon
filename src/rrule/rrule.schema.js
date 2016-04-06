import moment from 'moment';
import {RRule, RRuleSet, rrulestr} from 'rrule';
import {Schema, pre, post} from 'mongoose-model-decorators';

const MAX_COUNT = 100;

@Schema({ _id: false })
class RRuleSchema{

	// https://github.com/jkbrzt/rrule#rrule-constructor
	static schema = {
        freq: {
			type: String,
			required: true,
			validate: {
				validator: validateFreq,
				message: `{PATH} must be of ${RRule.FREQUENCIES.join(', ')}`
			}
		},
		_dtstart: { type: Date, private: true },
		until: {
			type: Date,
			validate: {
				validator: validateUntil,
				message: `{PATH} must be greater than event start date`
			}
		},
        count: {
			type: Number,
			default: 30,
			min: 1,
			max: [MAX_COUNT, `{PATH} limited to ${MAX_COUNT} for performance reasons`]
		},
		interval: {
			type: Number,
			default: 1,
			min: 1
		}
	};

	@pre('save')
	uppercaseFreq(){
		this.freq = this.freq.toUpperCase();
	}

	@pre('save')
	computeMaxCount(){
		if(this.until)
			this.count = MAX_COUNT;
	}

	get dtstart(){
		return this._dtstart;
	}

	set dtstart(val){
		this._dtstart = val;
	}

	generate(between){
		let rrule = new RRule({
			freq: RRule[this.freq],
			dtstart: this.dtstart,
			count: this.count,
			interval: this.interval,
			until: this.until
		});

		if(between && between.after && between.before)
			return rrule.between(between.after, between.before);
		return rrule.all();
	}
}

function validateFreq(freq){
	return (RRule.FREQUENCIES.indexOf(freq.toUpperCase()) !== -1);
}

function validateUntil(until){
	// validation runs on parent doc (which does not have _dtstart)
	// weird !
	if(!this._dtstart)
		return true;
	return moment(until).isAfter(this._dtstart);
}

const rruleSchema = new RRuleSchema();

export default rruleSchema;

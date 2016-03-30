import moment from 'moment';
import {RRule, RRuleSet, rrulestr} from 'rrule';
import {Schema, pre, post} from 'mongoose-model-decorators';

const MAX_COUNT = 100;

@Schema
class RRuleSchema{

	// https://github.com/jkbrzt/rrule#rrule-constructor
	static schema = {
        freq: {
			type: String,
			required: true,
			validate: {
				validator: validateFreq,
				message: `Frequency must be of ${RRule.FREQUENCIES.join(', ')}`
			}
		},
		_dtstart: { type: Date, required: true, private: true },
		until: {
			type: Date,
			validate: {
				validator: validateUntil,
				message: `until parameter must be greater than event start date`
			}
		},
        count: {
			type: Number,
			default: 30,
			min: 1,
			max: [MAX_COUNT, `Generation limited to ${MAX_COUNT} for performance reasons`]
		},
		interval: {
			type: Number,
			default: 1,
			min: 1
		}
	};

	@pre('validate')
	uppercaseFreq(next){
		this.freq = this.freq.toUpperCase();
		next();
	}

	@pre('validate')
	computeMaxCount(next){
		if(this.until)
			this.count = MAX_COUNT;
		next();
	}

	generate(){
		return new RRule({
			freq: RRule[this.freq],
			dtstart: this._dtstart,
			count: this.count,
			interval: this.interval,
			until: this.until
		}).all();
	}
}

function validateFreq(freq){
	return (RRule.FREQUENCIES.indexOf(freq) !== -1);
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

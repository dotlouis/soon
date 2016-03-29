import moment from 'moment';

export default function(defaults){
	if(!defaults || !defaults.rangeLength || !defaults.rangeUnit){
		throw new Error('Must specify default rangeLength and rangeUnit');
	}

	return function(startParam, endParam, durationParam){
		let start, end, duration;

		if(startParam){
			start = moment(startParam);
			if(end && end.isAfter(start)){
				duration = moment.duration(start.diff(end));
			}
			else if (!end){
				if(durationParam)
					duration = moment.duration(durationParam);
				else
					duration = moment.duration(defaults.rangeLength, defaults.rangeUnit);
			}
			else
				throw new RangeError('End date must be greater than Start date');
			end = moment(start).add(duration);
		}

		// end parameter take precedence over duration
		else if(endParam){
			end = moment(endParam);
			if(start && start.isBefore(end)){
				duration = moment.duration(end.diff(start));
			}
			else if (!start){
				if(durationParam)
					duration = moment.duration(durationParam);
				else
					duration = moment.duration(defaults.rangeLength, defaults.rangeUnit);
			}
			else
				throw new RangeError('End date must be greater than Start date');
			start = moment(end).subtract(duration);
		}

		// if none are specified, default range is set
		else{
			if(durationParam)
				duration = moment.duration(durationParam);
			else
				duration = moment.duration(defaults.rangeLength, defaults.rangeUnit);
			start = moment();
			end = moment(start).add(duration);
		}

		return {
			start: start.toDate(),
			end: end.toDate(),
			duration: duration.toJSON()
		};
	};
}

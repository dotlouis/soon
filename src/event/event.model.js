import moment from 'moment';
import {debug} from '../logger/logger';

export default class Event{
	constructor(params = {}){

		this.createdAt = moment();
		this.updatedAt = this.createdAt;

		this.start = moment(params.start) || moment();
		this.duration = moment.duration(params.duration) || moment.duration(1,'h');
		this.end = moment(params.end) || moment(this.start).add(this.duration);

		debug(this);
	}
}

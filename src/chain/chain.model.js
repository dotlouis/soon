import moment from 'moment';
import {ObjectId, defaultSchema} from '../mongoose/mongoose';
import {Model, pre} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Chain{

	static schema = Object.assign({
		count: { type: Number, required: true, default: 0 },
		events: { type: [ObjectId], ref: 'Event', required: true, default: [] }
	}, defaultSchema);

	add(event){
		this.events.push(event._id);
		this.count++;
	}
}

export default Chain;

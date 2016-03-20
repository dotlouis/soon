import moment from 'moment';
import {ObjectId, defaultSchema} from '../mongoose/mongoose';
import {Model, pre} from 'mongoose-model-decorators';

@Model({ timestamps: true })
class Chain{
	static schema = Object.assign({}, defaultSchema);
}

export default Chain;

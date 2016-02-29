import * as ENV from '../env';
import log from '../logger/logger';
import mongoose from 'mongoose';
import privatePaths from 'mongoose-private-paths';

// use native Promises
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
mongoose.connect(ENV.MONGO_URL);

// globally enabled plugins (on all schemas)
mongoose.plugin(privatePaths);

export const connection = mongoose.connection;

export const defaultSchema = {
	// mongoose versionKey property
	__v: { type: Number, private: true }
};

// helper to declare ObjectId type of a schema
export const ObjectId = mongoose.Schema.Types.ObjectId;

connection.on('error', err=>log.error(new Error(err)));
connection.once('open', ()=>log.info(`Connected to ${ENV.MONGO_URL}`));

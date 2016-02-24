import * as ENV from '../env';
import log from '../logger/logger';
import mongoose from 'mongoose';

// use native Promises
// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
mongoose.connect(ENV.MONGO_URL);

export const connection = mongoose.connection;

connection.on('error', err=>log.error(new Error(err)));
connection.once('open', ()=>log.info(`Connected to ${ENV.MONGO_URL}`));

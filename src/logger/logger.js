import * as ENV from '../env';
import bunyan from 'bunyan';
import bunyanRequest from 'express-bunyan-logger';

const logger = bunyan.createLogger({ name: ENV.APP_NAME });
const requestLogger = bunyanRequest({
	logger: logger,
	// excludes all properties to get a clean morgan-like output
	excludes: ['*']
});

export {requestLogger};
export default logger;

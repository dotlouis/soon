import * as ENV from '../env';
import bunyan from 'bunyan';
import bunyanRequest from 'express-bunyan-logger';

const logger = bunyan.createLogger({ name: ENV.APP_NAME });

// Enable debug-level logging while in development
if(ENV.NODE_ENV === 'development'){
	logger.level(bunyan.DEBUG);
}

// helper to simlpify debugging statements throught the app.
const debug = (obj) => logger.debug({debug:obj});

// A middleware that will log requests
const requestLogger = bunyanRequest({
	logger: logger,
	// excludes all properties to get a clean morgan-like output
	excludes: ['*']
});

export {requestLogger, debug};
export default logger;

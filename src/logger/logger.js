import * as ENV from '../env';
import bunyan from 'bunyan';
import bunyanRequest from 'express-bunyan-logger';

const logger = bunyan.createLogger({
	name: ENV.APP_NAME,
	serializers: bunyan.stdSerializers
});

// Enable debug-level logging while in development
if(ENV.NODE_ENV === 'development'){
	logger.level(bunyan.DEBUG);
}

// helper to simlpify debugging statements throught the app.
const debug = (obj) => logger.debug({debug:obj});

function logLevel(status, err, meta){
	if (status >= 500) { // server internal error or error
		return "error";
	} else if (status >= 400) { // client error
		return "warn";
	}
	return "info";
}

// A middleware that will log requests
const requestLogger = bunyanRequest({
	logger: logger,
	levelFn: logLevel,
	// excludes all properties for non-error requests
	excludes: ['*']
});
// An errorHandler middleware that will log errors
const errorLogger = bunyanRequest.errorLogger({
	logger: logger,
	levelFn: logLevel
});

export {requestLogger, errorLogger, debug};
export default logger;

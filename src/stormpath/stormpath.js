import stormpath from 'express-stormpath';
import bluebird from 'bluebird';
import log from '../logger/logger';
import * as ENV from '../env';


export let stormpathOptions = {
	apiKey: {
		id: ENV.STORMPATH_CLIENT_APIKEY_ID,
		secret: ENV.STORMPATH_CLIENT_APIKEY_SECRET
	},
	expand: {
		apiKeys: true,
		customData: true
	},
	application: {
		href: ENV.STORMPATH_APPLICATION_HREF
	},
	logger: log,
	debug: 'info',
	web: {
		produces: ['application/json'],
		login: {
			enabled: false
		},
		logout: {
			enabled: false
		},
		me: {
			enabled: false
		},
		oauth2: {
			enabled: false
		},
		register: {
			enabled: false
		}
	}
};

// stormpath = bluebird.promisifyAll(stormpath);
// console.log("DISPLAYING PROPERTIES");
// for(var p in stormpathSDK){
// 	console.log(p);
// 	// stormpathSDK[p] = bluebird.promisifyAll(stormpathSDK[p].prototype);
// }
// console.log("END DISPLAYING PROPERTIES");
//
// console.log("DISPLAYING RESOURCES");
// for(var p in stormpathResources){
// 	console.log(p);
// 	// stormpath[p] = bluebird.promisifyAll(stormpath[p].prototype);
// }
// console.log("END DISPLAYING RESOURCES");


export function promisifyStormpathApp(app){
	let stormpathApp = app.get('stormpathApplication');
	if(stormpathApp){
		app.set('stormpathApplication', bluebird.promisifyAll(stormpathApp));
	}
}

export default function(app){
	app.on('stormpath.ready',()=>{
		log.info('Connected to Stormpath');
		promisifyStormpathApp(app);
	});

	return stormpath.init(app, stormpathOptions);
}

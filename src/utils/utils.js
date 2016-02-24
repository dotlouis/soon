// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
export function wrap(fn){
	return (...args) => fn(...args).catch(args[2]);
}

export function delay(time, value, rejected){
	return new Promise(function(resolve, reject){
		setTimeout(()=>{
			if(rejected)
				reject(value);
			else
				resolve(value);
		}, time);
	});
}

import 'extend-error';

export const UnexpectedError = Error.extend('UnexpectedError', 500);
export const AppError = Error.extend('AppError', 500);
export const ClientError = Error.extend('ClientError', 400);

export const BadRequest = ClientError.extend('BadRequest', 400);
export const NotFound = ClientError.extend('NotFound', 404);
export const NoContent = ClientError.extend('NoContent', 204);


// Does what notFoundify and noContentify do
// plus wrap Cast and Validation errors as BadRequest
ClientError.clientify = async function(resource, resourceName){
	try{
		let res = await resource;
		if(!res) throw new NotFound(`${resourceName} not found`);
		if(res.length === 0) throw new NoContent(`no ${resourceName} found`);
	}
	catch(err){
		switch(err.name){
			case 'CastError':
			case 'ValidationError':
				throw new BadRequest(`Wrong ${resourceName} format`);
				break;
			default:
				throw new AppError(err);
		}
	}
};

// Takes a query and throws NotFound if the result is null
NotFound.notFoundify = async function(query){
	let result = await query;
	if(!result) throw new this();
	return result;
};

// Takes a query and throws NotFound if the result is null
NoContent.noContentify = async function(query){
	let results = await query;
	if(results && results.length === 0) throw new this();
	return results;
};

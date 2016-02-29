import 'extend-error';

export const ClientError = Error.extend('ClientError', 400);

export const NotFoundError = ClientError.extend('NotFoundError', 404);
export const NoContentError = ClientError.extend('NoContentError', 204);

// Takes a query and throws NotFoundError if the result is null
NotFoundError.notFoundify = async function(query){
	let result = await query;
	if(!result) throw new this();
	return result;
};

// Takes a query and throws NotFoundError if the result is null
NoContentError.noContentify = async function(query){
	let results = await query;
	if(results && results.length === 0) throw new this();
	return results;
};

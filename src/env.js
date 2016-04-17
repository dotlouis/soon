import pkg from '../package.json';

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const APP_HOST = process.env.APP_HOST || '0.0.0.0';
export const APP_PORT = process.env.APP_PORT || '8080';
export const APP_NAME = process.env.APP_NAME || pkg.name;

export const API_ROOT = process.env.API_ROOT || '/api';
export const API_VERSION = process.env.API_VERSION || pkg.version.split('.').shift();
export const API_PATH = process.env.API_PATH || `${API_ROOT}/v${API_VERSION}`;

export const MONGO_DB_NAME = process.env.MONGO_DB_NAME || pkg.name;
export const MONGO_PORT = process.env.MONGO_PORT || '27017';
export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const MONGO_URL = process.env.MONGO_URL || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

export const STORMPATH_CLIENT_APIKEY_ID = process.env.STORMPATH_CLIENT_APIKEY_ID;
export const STORMPATH_CLIENT_APIKEY_SECRET = process.env.STORMPATH_CLIENT_APIKEY_SECRET;
export const STORMPATH_APPLICATION_HREF = process.env.STORMPATH_APPLICATION_HREF;

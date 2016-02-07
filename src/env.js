import pkg from '../package.json';

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const APP_HOST = process.env.APP_HOST || '0.0.0.0';
export const APP_PORT = process.env.APP_PORT || '8080';
export const APP_NAME = process.env.APP_NAME || pkg.name;

export const API_ROOT = process.env.API_ROOT || '/api';
export const API_VERSION = process.env.API_VERSION || pkg.version.split('.').shift();
export const API_PATH = process.env.API_PATH || `${API_ROOT}/v${API_VERSION}`;

import pkg from '../package.json';

export const APP_PORT = process.env.APP_PORT || '8080';
export const API_VERSION = process.env.API_VERSION || pkg.version.split('.').shift();
export const API_PATH = process.env.API_PATH || `/api/v${API_VERSION}`;

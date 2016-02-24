// Babel-register to compile the code on the fly
// https://babeljs.io/docs/usage/require/
require('babel-polyfill');
require('babel-register')({
	"presets": ["es2015", "stage-0"],
	"plugins": ["transform-decorators-legacy"],
	"sourceMaps": true,
	"compact": false,
	"comments": true
});
require('./app');

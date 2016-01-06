// Babel-register to compile the code on the fly
// https://babeljs.io/docs/usage/require/
require('babel-polyfill');
require('babel-register')({
	"presets": ["es2015", "stage-0"],
	"sourceMaps": true,
	"compact": false,
	"comments": true
});
require('./server');

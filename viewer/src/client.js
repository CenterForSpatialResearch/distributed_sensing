const $ = require('jquery')
require('bootstrap')
$('#directory').load('/directory')
$('#main').load('/main', function() {
	require('./map.js')	
})
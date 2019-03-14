const $ = require('jquery')
require('bootstrap')
require('./map.js')

$('#directory').load('/directory')

$('body').on('click', '.directory-item', function(e) {
    let key = $(this).text()
    console.log(name)
    $('#main').load(`/main/${key}`, () => {
        makeMap()
    })     
})
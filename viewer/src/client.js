const $ = require('jquery')
require('bootstrap')
require('./map.js')

$('#directory').load('/directory')



$('body').on('mouseover', '.directory-item', function(e) {
    $(this).css('cursor', 'pointer')
})

$('body').on('click', '.directory-item', function(e) {
    if ($(this).hasClass('active')) return
    $('.directory-item').removeClass('active')
    $(this).addClass('active')  
    let key = $(this).attr('key')
    console.log(name)
    $('#main').load(`/main/${key}`, () => {
        makeMap()
    })     
})



/*

how to read data from a feed.

-- a type for the feeds?

*/
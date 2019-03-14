'use strict'

const $ = require('jquery')
require('bootstrap')
require('./map.js')

let loadDirectory = () => {
    $('#directory').load('/directory', () => {

        $('.directory-item').css('cursor', 'pointer')
        
        $('.directory-item').click(function(e) {
            if ($(this).hasClass('active')) return
            $('.directory-item').removeClass('active')
            $(this).addClass('active')  
            let key = $(this).attr('key')
            loadMain(key)
        })

        $('#key_input_feedback').show()
        $('#name_input_feedback').show()
        $('#new-feed-form').on('submit', function(e) {
            e.preventDefault()
            let key = $('#key_input').val()
            let name = $.trim($('#name_input').val())
            let valid = true
            if (!checkKey(key)) {
                $('#feedback_content').html('Key must be a valid 64-character hexidecimal string')
                valid = false
            } else if (name.length == 0) {
                $('#feedback_content').html('Please enter a name for this feed')
                valid = false
            }
            if (!valid) {
                $('#feedback').modal('show')               
            } else {
                // send some shit to the server
                // on success,
                loadDirectory()
            }
        })

    })
}

let loadMain = (key) => {
    $('#main').load(`/main/${key}`, () => {
        makeMap()
    })     
}

let checkKey = (input) => {
    let re = /[0-9A-Fa-f]{64}/g
    return re.test(input)
}

loadDirectory()


/*

how to read data from a feed.

-- a type for the feeds?

SLEEP data format -- is there metadata in there?

*/
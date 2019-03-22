'use strict'

const $ = require('jquery')
require('bootstrap')
require('./map.js')

let map = null

const loadDirectory = (key) => {
    $('#directory').load('/directory', () => {

        if (key != null) {
            $('.directory-item').each(function (index, value) {
                if ($(this).attr('key') == key) {
                    $(this).addClass('active')
                    loadMain(key)
                }
            })
        }

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
                console.log('/subscribe')
                $.post('/subscribe', {key: key, name: name}, (data) => {
                    loadDirectory(key)
                }).fail((response) => {
                    $('#feedback_content').html(response.status + " " + response.statusText)
                    $('#feedback').modal('show') 
                }) 
            }
        })

    })
}

const loadMain = (key) => {
    map = null
    $('#main').load(`/main/${key}`, () => {

        $('#unsubscribe').click(function(e) {
            let key = $(this).attr('key')    
            $.post('/unsubscribe', {key: key}, (data) => {
                loadDirectory(key)
                $('#main').html('')
            }).fail((response) => {
                $('#feedback_content').html(response.status + " " + response.statusText)
                $('#feedback').modal('show') 
            })     
        })        

        $('#refresh').click(function(e) {
            let key = $(this).attr('key')    
            fetchData(key)
        })  

        fetchData(key)

    })     
}

const fetchData = (key, callback) => {
    $.post('/fetch', {key: key}, (data) => {
        $.getJSON(`/data/${key}`, (data) => {
            let points = []
            for (const datum of data) {
                if (typeof datum === 'object') {
                    if (    ('latitude' in datum || 'lat' in datum || 'Latitude' in datum) && ('longitude' in datum || 'lon' in datum || 'lng' in datum || 'Longitude' in datum)  ) {
                        points.push(datum)
                    }
                }
            }
            if (points.length) {
                if (map == null) {
                    map = makeMap()
                }
                map.update(points)
            }
        })  
        if (callback) {              
            callback()
        }
    }).fail((response) => {
        $('#feedback_content').html(response.status + " " + response.statusText)
        $('#feedback').modal('show') 
    })     
}

const checkKey = (input) => {
    const re = /[0-9A-Fa-f]{64}/g
    return re.test(input)
}

loadDirectory()

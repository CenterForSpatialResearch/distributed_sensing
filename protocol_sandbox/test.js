var hypercore = require('hypercore')
var ram = require('random-access-memory')

let feed = hypercore(function(filename) {
	return ram()
}, {valueEncoding: 'utf-8'})

// var feed = hypercore('./my-first-dataset', {valueEncoding: 'utf-8'})

feed.append('hello')
feed.append('world ', function (err) {
  if (err) throw err
  feed.get(0, console.log) // prints hello
  feed.get(1, console.log) // prints world
  feed.head(console.log)
})
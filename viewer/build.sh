# https://scotch.io/tutorials/getting-started-with-browserify

# browserify main.js --debug | exorcist bundle.map.js > bundle.js

watchify client.js -o 'exorcist bundle.js.map > bundle.js' -d -v
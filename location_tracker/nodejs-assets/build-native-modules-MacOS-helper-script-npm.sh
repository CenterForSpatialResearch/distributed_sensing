#!/bin/bash
      # Helper script for Gradle to call npm on macOS in case it is not found
      export PATH=$PATH:/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/jeevanfarias/Documents/columbia/center_for_spatial_research/distributed_sensing/location_tracker/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/jeevanfarias/Documents/columbia/center_for_spatial_research/distributed_sensing/location_tracker/node_modules/.bin:/Users/jeevanfarias/.opam/default/bin:/Users/jeevanfarias/.rvm/gems/ruby-2.2.4/bin:/Users/jeevanfarias/.rvm/gems/ruby-2.2.4@global/bin:/Users/jeevanfarias/.rvm/rubies/ruby-2.2.4/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin:/opt/X11/bin:/Applications/Wireshark.app/Contents/MacOS:/Users/jeevanfarias/.rvm/bin
      npm $@
    
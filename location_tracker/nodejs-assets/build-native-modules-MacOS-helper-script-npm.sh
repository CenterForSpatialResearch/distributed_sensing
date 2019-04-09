#!/bin/bash
      # Helper script for Gradle to call npm on macOS in case it is not found
      export PATH=$PATH:/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/dimitrileggas/Documents/hyfa/location_tracker/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/dimitrileggas/Documents/hyfa/location_tracker/node_modules/.bin:/anaconda2/bin:/Users/dimitrileggas/google-cloud-sdk/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin
      npm $@
    
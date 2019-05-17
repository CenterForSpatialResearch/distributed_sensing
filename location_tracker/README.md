# HyFA Location Tracker

This folder contains the Location Tracker app for the HyFA network. This is a React Native implementation, that has only been tested on iOS thus far.
HyFA Location Tracker uses the Hypercore and Hyperdrive implementations of [DAT](https://datproject.org) to enable mobile users to share data peer-to-peer. In order to run DAT on mobile, we make use of [nodejs-mobile-react-native](https://github.com/janeasystems/nodejs-mobile-react-native) to run a NodeJS background thread that can interface with the userspace React Native application. See below for details. Because this repo contains submodules, clone with
`git clone --recurse-submodules <url>`
or after cloneing, run:
```bash
git submodule init
git submodule update
```

------
## Guide to Core Files
### App.js
This is the React Native side of the app. This file implements the UI/UX, and interfaces with the NodeJS background thread via `require('rn-bridge')`. 
### nodejs-assets/nodejs-project/main.js
This file contains the NodeJS code that allows HyFA to share data over DAT. Installing packages like Hypercore and Hyperdrive with `npm` causes problems when this code is bundled into a React Native build. To address this, we include Hypercore and Hyperdrive as submodules within the repo, and `require()` them as local directories.



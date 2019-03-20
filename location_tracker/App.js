/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";
import Realm from 'realm';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const locationSchema = {
    name: 'Location',
    properties: {
        time: 'string',
        odometer: 'float',
        is_moving: 'bool',
        lat: 'float',
        lon: 'float',
        uuid: 'string'
    }
};



type Props = {};
export default class App extends Component < Props > {
    constructor(props) {
        super(props);
        this.state = {
            location: { lat: 0, lon: 0 },
            realm: null
        };
    }

    addRealm(location){
      let realm = this.state.realm;
        realm.write(()=>{
          realm.create('Location',{
            time: location.timestamp,
            odometer: location.odometer,
            is_moving: location.is_moving,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            uuid: location.uuid
          });
        });
    }

    onClickGetCurrentPosition() {
        BackgroundGeolocation.getCurrentPosition({
            persist: true,
            samples: 1
        }, (location) => {
            // this.setState({location:location})
            var coords = { lat: 0, lon: 0 };
            coords.lat = location.coords.latitude;
            coords.lon = location.coords.longitude;
            this.setState({ location: coords });
            console.log(coords)
            console.log(this.state.realm)
        }, (error) => {
            console.warn('- getCurrentPosition error: ', error);
        });
    }
    getLocation() {
        return this.state.location.lat + "," + this.state.location.lon;
    }

    render() {
        return (
            <View style={styles.container}>
        <Text style={styles.welcome}>Distributed Sensing App</Text>
        <Text style={styles.instructions}> Location {this.state.location.lat} {this.state.location.lon}</Text>
        <Button
            onPress={this.onClickGetCurrentPosition.bind(this)}
            title="Press Me"
          />
        <Text style={styles.welcome}>
            # of objects in Realm: {this.state.realm ? this.state.realm.objects('Location').length : 0}
        </Text>
        
      </View>
        );
    }


    componentWillMount() {
        // this.setState({realm: realm});
        Realm.open({
            schema: [locationSchema]
        }).then(realm => {
            this.setState({ realm });
        });

        ////
        // 1.  Wire up event-listeners
        //

        // This handler fires whenever bgGeo receives a location update.
        BackgroundGeolocation.onLocation(this.onLocation.bind(this), this.onError);

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.onMotionChange(this.onMotionChange);

        // This event fires when a change in motion activity is detected
        BackgroundGeolocation.onActivityChange(this.onActivityChange);

        // This event fires when the user toggles location-services authorization
        BackgroundGeolocation.onProviderChange(this.onProviderChange);

        ////
        // 2.  Execute #ready method (required)
        //
        BackgroundGeolocation.ready({
            // Geolocation Config
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true, // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url: 'http://yourserver.com/locations',
            batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: { // <-- Optional HTTP headers
                "X-FOO": "bar"
            },
            params: { // <-- Optional HTTP params
                "auth_token": "maybe_your_server_authenticates_via_token_YES?"
            }
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

            if (state.enabled) {
                ////
                // 3. Start tracking!
                //
                BackgroundGeolocation.start(function() {
                    console.log("- Start success");
                });
                BackgroundGeolocation.getCurrentPosition({
                        persist: true,
                        samples: 1
                    },
                    (location) => this.props.location = location,
                    (error) => console.log(error))
            }
        });
    }

    // You must remove listeners when your component unmounts
    componentWillUnmount() {
        BackgroundGeolocation.removeListeners();
    }


    onLocation(location) {
        console.log('[location] -', location);
        var coords = { lat: 0, lon: 0 };
            coords.lat = location.coords.latitude;
            coords.lon = location.coords.longitude;
            this.setState({ location: coords });
        this.addRealm(location)

    }
    onError(error) {
        console.warn('[location] ERROR -', error);
    }
    onActivityChange(event) {
        console.log('[activitychange] -', event); // eg: 'on_foot', 'still', 'in_vehicle'
    }
    onProviderChange(provider) {
        console.log('[providerchange] -', provider.enabled, provider.status);
    }
    onMotionChange(event) {
        console.log('[motionchange] -', event.isMoving, event.location);
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
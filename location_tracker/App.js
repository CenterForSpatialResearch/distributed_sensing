/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import { Container,
         Icon,
         Text,
         Button,
         Header, Footer, Title,
         Content,
         Left, Body, Right,
         Switch 
       } from 'native-base';

import Realm from 'realm';

import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';

import BackgroundGeolocation from "react-native-background-geolocation";
import { Location,
         MotionChangeEvent,
         MotionActivityEvent,
         ProviderChangeEvent 
       } from "react-native-background-geolocation";

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
export default class LocationTracker extends Component < Props > {
    constructor(props) {
        super(props);
        this.state = {
            location: { lat: 0, lon: 0 },
            realm: null
        };
    }

    addRealm(location) {
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

    clearRealm() {
        let realm = this.state.realm;
        realm.write(() => {
            realm.deleteAll()
        });
        this.forceUpdate();
    }

    componentDidMount() {
        // Step 0:  Setup persistent storage
        Realm.open({
            schema: [locationSchema]
        }).then(realm => {
            this.setState({ realm });
        });

        // Step 1:  Listen to events:
        BackgroundGeolocation.onLocation(this.onLocation.bind(this), this.onError);
        BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
        BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
        BackgroundGeolocation.onProviderChange(this.onProviderChange.bind(this));
        BackgroundGeolocation.onPowerSaveChange(this.onPowerSaveChange.bind(this));

        // Step 2:  Execute Ready Method
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
            startOnBoot: true // <-- Auto start tracking when device is powered-up.
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
            if (state.enabled) {
                // Step 3:  Start Tracking
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
    onPowerSaveChange(isPowerSaveMode:boolean) {
        console.log('[event] powersavechange', isPowerSaveMode);
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

    // You must remove listeners when your component unmounts
    componentWillUnmount() {
        BackgroundGeolocation.removeListeners();
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Body>
                        <Title style={styles.title}>Distributed Sensing</Title>
                    </Body>
                </Header>

                <MapView
                ref="map"
                style={styles.map}
                showsUserLocation={this.state.showsUserLocation}
                followsUserLocation={false}
                scrollEnabled={true}
                showsMyLocationButton={false}
                showsPointsOfInterest={false}
                showsScale={false}
                showsTraffic={false}
                toolbarEnabled={false}>
                </MapView>

                <Footer style={styles.footer}>
                    <Left style={{flex:0.25}}>
                        <Button rounded style={styles.icon}>
                            <Icon active name="md-navigate" style={styles.icon} onPress={this.onClickGetCurrentPosition.bind(this)} />
                        </Button>
                    </Left>
                    <Body style={styles.footerBody}>
                        { /* <Text style={styles.footer}>Saved Pins: {this.state.realm ? this.state.realm.objects('Location').length : 0}</Text> */}
                        <Text style={styles.footer}>loc: {this.state.location.lat} {this.state.location.lon}</Text>
                    </Body>
                    <Right style={{flex: 0.25}}>
                        <Button rounded style={styles.icon}>
                            <Icon active name="trash" style={styles.icon} onPress={ this.clearRealm.bind(this) } />
                        </Button>
                    </Right>
                </Footer>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#272727'
    },
    header: {
        backgroundColor: '#660d5d'
    },
    title: {
        color: '#f0ead6',
        fontSize: 24
    },
    footer: {
        backgroundColor: '#660d5d',
        color: '#ba96b6',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10
    },
    footerBody: {
        justifyContent: 'center',
        width: 200,
        flex: 1
    },
    icon: {
        backgroundColor: '#f0ead6',
        color: '#660d5d'
    },
    map: {
        flex: 1
    },
    status: {
        fontSize: 12
    },
    markerIcon: {
        borderWidth:1,
        borderColor:'#000000',
        backgroundColor: 'rgba(0,179,253, 0.6)',
        width: 10,
        height: 10,
        borderRadius: 5
    }
});

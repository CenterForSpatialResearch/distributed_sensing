/**
 * location_tracker
 */

import React from 'react';
import { Component } from 'react';

import { StyleSheet, 
         View,
         Share
       } from 'react-native';

import { Container,
         Icon,
         Text,
         Button,
         Content,
         Header, Footer, Title,
         Left, Body, Right,
         Switch 
       } from 'native-base';

import Realm from 'realm';

import BackgroundGeolocation from "react-native-background-geolocation";
import { Location,
         MotionChangeEvent,
         MotionActivityEvent,
         ProviderChangeEvent 
       } from "react-native-background-geolocation";

import nodejs from 'nodejs-mobile-react-native';

import MapboxGL from '@mapbox/react-native-mapbox-gl';
MapboxGL.setAccessToken('pk.eyJ1IjoiYnJpYW5ob3VzZSIsImEiOiJXcER4MEl3In0.5EayMxFZ4h8v4_UGP20MjQ');

const locationSchema = {
    name: 'Location',
    properties: {
        time: 'string',
        odometer: 'float',
        is_moving: 'bool',
        lat: 'float',
        lon: 'float',
        uuid: 'string',
    }
};

let isDatInit = 0
let shareOptions = {
    message: null,
};

type Props = {};
export default class LocationTracker extends Component <Props> {
    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            location: { lat: 0, lon: 0 },
            realm: null,
            coordinates: [],
            shareVisible: false,
            showUserLocation: true,
            following: true,
            currentTrackingMode: MapboxGL.UserTrackingModes.Follow
        };
    }

    addRealm(location) {
      let realm = this.state.realm;
        realm.write(()=>{
          realm.create('Location', {
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
        console.log(realm.objects('Location')[0]['time'])
        console.log(realm.objects('Location')[1]['time'])
        realm.write(() => {
            realm.deleteAll()
        });
        this.setState({
            coordinates: []
        });
        this.forceUpdate();
    }

    addToDat(location){
        let obj = {};
        if (isDatInit){
            obj = location;
            obj.type = "add";
        } else{
            isDatInit = 1;
            obj.type = "init";
        }
        console.log(JSON.stringify(obj))
        nodejs.channel.send(obj)
    }

    // this needs work
    getFromDat(){
        let obj = {};
        obj.type = "get";
        nodejs.channel.send(obj);
    }

    // ultimately delete this
    addMarker(location:Location) {
        this.setState({
            coordinates: [...this.state.coordinates, 
                [ location.coords.longitude, location.coords.latitude ]
            ]
        });

    }  

    renderMarker(counter) {
        const id = `pointAnnotation${counter}`;
        const coordinate = this.state.coordinates[counter];
        const title = `Longitude: ${this.state.coordinates[counter][1]} Latitude: ${this.state.coordinates[counter][0]}`;
        return (
            <MapboxGL.PointAnnotation
                key={id}
                id={id}
                title='Test'
                coordinate={coordinate}>
            </MapboxGL.PointAnnotation>
        );
    }

    renderMarkers() {
        const items = [];
        for (let i = 0; i < this.state.coordinates.length; i++) {
            items.push(this.renderMarker(i));
        }
        return items;
    }

    componentDidMount() {
        // Initialize feed/swarm
		nodejs.start("main.js");
		nodejs.channel.addListener(
            "message",
            (msg) => {
                console.log("From node: " + msg);
                // store the DAT public key for sharing
                if(msg.substring(0, 5) == "key: "){ 
                    shareOptions.message = msg.substring(5);
                    console.log(shareOptions.url)
                }
            },
            this
    	);
        
				
		// Setup persistent storage
        Realm.open({
            schema: [locationSchema]
        }).then(realm => {
            this.setState({ realm });
        });

        this.onUserTrackingModeChange = this.onUserTrackingModeChange.bind(this);

        // Listen to location events:
        BackgroundGeolocation.onLocation(this.onLocation.bind(this), this.onError);
        BackgroundGeolocation.onMotionChange(this.onMotionChange.bind(this));
        BackgroundGeolocation.onActivityChange(this.onActivityChange.bind(this));
        BackgroundGeolocation.onProviderChange(this.onProviderChange.bind(this));
        BackgroundGeolocation.onPowerSaveChange(this.onPowerSaveChange.bind(this));

        // Configure Background Geolocation
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            stopTimeout: 1,
            debug: false, 
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,
            startOnBoot: true 
        }, (state) => {
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
            this.setState({
                enabled: state.enabled,
            });
        });
    } 

    onLocation(location) {
        console.log('[location] -', location);
        var coords = { lat: 0, lon: 0 };
        coords.lat = location.coords.latitude;
        coords.lon = location.coords.longitude;
        this.setState({ location: coords });
        this.addRealm(location);    // ultimately delete this
        this.addMarker(location);   // ultimately delete this
        this.addToDat(location);
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

    onToggleEnabled() {
        let enabled = !this.state.enabled;
        this.setState({
            enabled: enabled,
        });
        if (enabled) {
            BackgroundGeolocation.start();
        } else {
            BackgroundGeolocation.stop();
        }
    }

    onCenterMap () {
        // need to figure out how to re-center map
        console.log('center');
        this.setState({currentTrackingMode: MapboxGL.UserTrackingModes.Follow});
        
    }

    sharePublicKey = () => {
        Share.share(shareOptions)
        .then(result => console.log(result))
        .catch(error => console.log(error));
    }

    // You must remove listeners when your component unmounts
    componentWillUnmount() {
        BackgroundGeolocation.removeListeners();
    }

  
      onUserTrackingModeChange(e) {
        this.state.following = !this.state.following;
        if (this.state.following){
            this.setState({currentTrackingMode: MapboxGL.UserTrackingModes.Follow});

        } else{
            this.setState({currentTrackingMode: MapboxGL.UserTrackingModes.None});

        }

      }


    render() {
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left style={{flex:0.25}}>
                        <Switch onValueChange={() => this.onToggleEnabled()} value={this.state.enabled} />
                    </Left>
                    <Body style={{flex:1}}>
                        <Title style={styles.title}>Distributed Sensing</Title>
                    </Body>
                    <Right style={{flex: 0.25}}>
                        <Button rounded style={styles.icon}>
                            <Icon active name="ios-share" style={styles.icon} onPress={ this.sharePublicKey } />
                        </Button>
                    </Right>
                </Header>

                <MapboxGL.MapView
                    ref={(c) => this._map = c}
                    style={{flex: 1}}
                    zoomLevel={15}  
                    showUserLocation = {true}
                    userTrackingMode = {this.state.currentTrackingMode}
                    onUserTrackingModeChange = {this.onUserTrackingModeChange}
                    >{this.renderMarkers()}
                </MapboxGL.MapView>

                <Footer style={styles.footer}>
                    <Left style={{flex:0.25}}>
                        <Button rounded style={styles.icon}>
                            <Icon active name="md-navigate" style={styles.icon} onPress={ this.onCenterMap.bind(this) } />
                        </Button>
                    </Left>
                    <Body style={styles.footerBody}>
                        <Text style={styles.footer}>Saved Pins: {this.state.realm ? this.state.realm.objects('Location').length : 0}</Text>
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
        backgroundColor: '#660d5d',
        height: 75
    },
    title: {
        color: '#f0ead6',
        fontSize: 18
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

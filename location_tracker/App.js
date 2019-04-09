/**
 * location_tracker
 */

import React from 'react';
import { Component } from 'react';

import { StyleSheet, 
         View,
         Clipboard,
         Alert
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

import Share, { ShareSheet, Button as ShareButton } from 'react-native-share';

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

const EMAIL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABC1BMVEUAAAA/Pz8/Pz9AQEA/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz9AQEA+Pj5AQEA/Pz87Ozs7Ozs/Pz8+Pj47OztAQEA/Pz89PT01NTVBQUFBQUE/Pz8/Pz8+Pj4/Pz9BQUE+Pj4/Pz8/Pz89PT0+Pj4/Pz9BQUFAQEA9PT09PT0/Pz87Ozs9PT05OTk/Pz8+Pj4/Pz9AQEA/Pz8/Pz8/Pz8/Pz+AgIA+Pj4/Pz8/Pz9AQEA/Pz8/Pz8/Pz8/Pz8+Pj4/Pz8/Pz8/Pz9AQEA+Pj4/Pz8+Pj4/Pz85OTk/Pz8/Pz8/Pz8/Pz88PDw9PT0/Pz88PDw8PDw+Pj45OTlktUJVAAAAWXRSTlMA/7N4w+lCWvSx8etGX/XlnmRO7+1KY/fjOGj44DU7UvndMec/VvLbLj7YKyiJdu9O7jZ6Um1w7DnzWQJz+tpE6uY9t8D9QehAOt7PVRt5q6duEVDwSEysSPRjqHMAAAEfSURBVEjH7ZTXUgIxGEa/TwURUFyKYgMURLCvbe2gYAV7ff8nMRksgEDiKl7lXOxM5p8zO3s2CWAwGAx/CjXontzT25Y+pezxtpv2+xTygJ+BYOvh4BBDwx1lKxxhNNZqNjLK+JjVWUYsykj4+2h8gpNTUMkIBuhPNE+SKU7PQC3D62E60ziYzXIuBx0Z+XRTc9F5fgF6MhKNzWXnRejKWGJdc9GZy8AP3kyurH52Ju01XTkjvnldNN+Qi03RecthfFtPlrXz8rmzi739Ax7mUCjy6FhH/vjPonmqVD6pdT718excLX/tsItLeRAqtc7VLIsFlVy/t6+ub27v7t8XD490niy3p+rZpv3i+jy/Or+5SUrdvcNcywaDwfD/vAF2TBl+G6XvQwAAAABJRU5ErkJggg==";
const CLIPBOARD_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAB5lBMVEUAAAA8PDw+Pj4/Pz8/Pz8/Pz8/Pz8+Pj47OzsAAAA5OTk+Pj4/Pz8/Pz8+Pj49PT0/Pz8/Pz85OTlAQEA/Pz87Ozs+Pj4+Pj4/Pz8/Pz8/Pz8zMzNBQUE/Pz8/Pz8/Pz9AQEA7Ozs9PT0/Pz9AQEA+Pj4/Pz8+Pj4AAABAQEA/Pz87OztBQUE/Pz8+Pj4zMzNDQ0M/Pz89PT03Nzc/Pz8/Pz8/Pz8/Pz88PDw8PDwAAABCQkI7Ozs9PT0/Pz9AQEA/Pz8uLi4rKytAQEA/Pz89PT0+Pj4/Pz8/Pz8/Pz9CQkJAQEA/Pz9CQkI/Pz8/Pz8/Pz8+Pj49PT0/Pz8yMjI/Pz88PDw/Pz9BQUE8PDw/Pz9AQEA/Pz8/Pz8/Pz89PT0/Pz9CQkI9PT1EREQ9PT08PDw4ODg+Pj6AgIA/Pz8/Pz82NjZVVVU7Ozs/Pz81NTVAQEA/Pz8+Pj49PT1BQUE/Pz8/Pz8/Pz8vLy8/Pz87OztAQEA3Nzc9PT0+Pj4/Pz89PT0/Pz8/Pz89PT1AQEA9PT04ODgzMzM/Pz8/Pz9AQEA/Pz9AQEA/Pz83Nzc9PT0/Pz9AQEA/Pz8+Pj4+Pj5AQEA/Pz89PT1FRUU5OTk/Pz8/Pz8+Pj47Ozs/Pz89PT08PDw+Pj6z1Mg0AAAAonRSTlMAEXTG8/7pslICKMn//J0u2LcSLNu9Y0523KoKL9b7hggauZsEOuJ/ARS7VifkiwUX0bEq1f1p6KGQAz4NpnpY8AsGtMIyb46NbSOMcRuh+fGTFc0z1yKFKy/dpKff1CqKMoYPp+lAgAKd6kIDhdorJJExNjflktMr3nkQDoXbvaCe2d2EijIUn3JsbjDDF1jjOOdWvIDhmhoJfWrAK7bYnMgx8fGWAAACNUlEQVRIx+2W6V8SURSGBxEVeydMbVER1DCwRNTCEhMNsywqExXcUrNVU9NK2wy1fd9sMyvrP+1cmYH5eK5f5f3APef85hnuvfPeM6MoaaW1dWXKMGdasrJzrJtgc7dhQ+p2kzRry4OuHfmSbEEhUTt37d5TRGNxiRRrLwUczjKKyiuI3uuSYCv3ARa3ZyOu2k/xAT5b7aXra3xaVlsH1LPZg4cAvzM10wbgMBs+QqtsDKTyJroXGz7a7AgandECtPLXfKzFY8hCbcBxFudpP3Gy49RpQ8UXtgBnOOzZc53CU+e7Ism7uYnt5ji0p1e3pDmqzTnmAEr7GGz/AGEDg0MXaBgeERXrKIWFBQz2IvlYHbtEh/EycOUqVQLXVCDPxvGz+MPYdRGWjE/coGFyyg9M32SwM8PkydlQIim7JX6DxHpvM9g7c+SjoLESmqd9vjvDYO9NEzs1aahYY7SK+3Zm31Ddmp8jDx4qysIj2qt4O6dviH4xqvk5soj40vJjqjzh7HOf6BtPtb1SnulG6X3O6bHdqb5BejHbKtDOl+UcQ78iNuwzFKKvwx1v3npYJ+kd0BYynqz3Eu2OZvnB+IyCRVE+TD5qSmWBRuDjJzb8GWhIJq4xv36kWKoH6mr1vlFDnvRW86e9Qtd/qUrs1VeKv1VKbJjrOz3Wih8UrTpF37ArMlotFmfg58raLxrjvyXfifl/ku/TdZsiK9NfNcH+y93Ed4A1JzvLkmnOMClppbV19R+iQFSQ2tNASwAAAABJRU5ErkJggg==";
let shareOptions = {
    title: "share your dat public key",
    message: "here's my dat public key",
    key: null,
    subject: "here's my dat public key" //  for email
};

type Props = {};
export default class LocationTracker extends Component <Props> {
    constructor(props) {
        super(props);
        this.state = {
            enabled: true,
            location: { lat: 0, lon: 0 },
            realm: null,
            // MapBox
            coordinates: [],
            // Share
            shareVisible: false
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
            markers: [],
            coordinates: []
        });
        this.forceUpdate();
    }

    addToDat(location){
        let obj = {};
        if (isDatInit){
            obj = location
            obj.type = "add"
        } else{
            isDatInit = 1;
            obj.type = "init"
        }
        console.log(JSON.stringify(obj))
        nodejs.channel.send(obj)
    }

    getFromDat(location){
        let obj = {};
        if (isDatInit){
            obj = location
            obj.type = "add"
        } else{
            isDatInit = 1;
            obj.type = "init"
        }
        console.log(JSON.stringify(obj))
        nodejs.channel.send(obj)
    }

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
        console.log('here is the problematic lat')
        console.log(this.state.coordinates[0])
        const items = [];
        for (let i = 0; i < this.state.coordinates.length; i++) {
          items.push(this.renderMarker(i));
        }
        return items;
    }

    componentDidMount() {
		nodejs.start("main.js");
		nodejs.channel.addListener(
            "message",
            (msg) => {
                console.log("From node: " + msg);
                if(msg.substring(0, 5) == "key: "){
                    shareOptions.key = msg.substring(5);
                    console.log(shareOptions.key);
                }
            },
            this
    	);
        
				
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

        // Step 2:  Configure Background Geolocation
        BackgroundGeolocation.configure({
            enabled: false,
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
        this.addRealm(location);
        this.addMarker(location);
        this.addHC(location);
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

    // You must remove listeners when your component unmounts
    componentWillUnmount() {
        BackgroundGeolocation.removeListeners();
    }

    onCancel() {
        console.log("CANCEL")
        this.setState({shareVisible:false});
    }
    onOpen() {
        console.log("OPEN")
        this.setState({shareVisible:true});
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
                            <Icon active name="ios-share" style={styles.icon} onPress={ this.onOpen.bind(this)} />
                        </Button>
                    </Right>
                </Header>

                <MapboxGL.MapView
                    ref={(c) => this._map = c}
                    style={{flex: 1}}
                    zoomLevel={15}
                    showUserLocation={true}
                    userTrackingMode={1}
                    >{this.renderMarkers()}
                </MapboxGL.MapView>

                <Footer style={styles.footer}>
                    <Left style={{flex:0.25}}>
                        <Button rounded style={styles.icon}>
                            <Icon active name="md-navigate" style={styles.icon} onPress={this.onClickGetCurrentPosition.bind(this)} />
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


                <ShareSheet visible={this.state.shareVisible} onCancel={this.onCancel.bind(this)}>
                    {/*
                    <ShareButton 
                        iconSrc={{ uri: EMAIL_ICON }}
                        onPress={()=>{
                            this.onCancel();
                            setTimeout(() => {
                                Share.shareSingle(Object.assign(shareOptions, {
                                    "social": "email"
                                }));
                            }, 300);
                        }}>
                        Email
                    </ShareButton>
                    */}

                    <ShareButton
                        iconSrc={{ uri: CLIPBOARD_ICON }}
                        onPress={()=>{
                            this.onCancel();
                            setTimeout(() => {
                                if(typeof shareOptions["url"] !== undefined) {
                                    Clipboard.setString(shareOptions["key"]);
                                    Alert.alert('dat public key copied to clipboard');
                                }
                            }, 300);
                        }}>
                        Copy Link
                    </ShareButton>

                </ShareSheet>

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

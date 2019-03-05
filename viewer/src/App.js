import React, { Component } from 'react'
import MapboxGl from 'mapbox-gl'
import KeyDrawer from './drawer'
import './App.css'
import './mapbox-gl.css'


class Map extends Component {

  componentDidMount() {
    MapboxGl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'

    new MapboxGl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/streets-v9',
      // style: 'mapbox://styles/brianhouse/cj3yywx4y0dgx2rpmyjfgnixx',
      center: [-73.96024, 40.80877],
      zoom: 12.5
    })
    .addControl(new MapboxGl.NavigationControl({
        showCompass: false
    }), "top-left")
    .addControl(new MapboxGl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    }), "bottom-right")

  }

  render() {
    return (
      <div className='Map' ref={(x) => { this.container = x }}>
      </div>
    )
  }
}


class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <KeyDrawer />
          Hello World
          <Map></Map>
        </header>
      </div>
    )
  }
}

export default App


// https://engineering.door2door.io/a-single-page-application-with-react-and-mapbox-gl-f96181a7ca7f
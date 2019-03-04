import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl'
import './App.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Hello World
          <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        </header>
      </div>
    );
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      // style: 'mapbox://styles/brianhouse/cj3yywx4y0dgx2rpmyjfgnixx',
      center: [-79.38, 43.65],
      zoom: 12.5
    });
  }

}

export default App
const mapboxgl = require('mapbox-gl')

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW5ob3VzZSIsImEiOiJXcER4MEl3In0.5EayMxFZ4h8v4_UGP20MjQ';

window.makeMap = () => {

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/brianhouse/cj3yywx4y0dgx2rpmyjfgnixx',
        zoom: 1,
        attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl({
        showCompass: false
    }), 'top-left')

    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    }), 'bottom-right')


    map.update = (points) => {

        let markers = []

        for (const point of points) {

            let lon = point['longitude'] || point['Longitude'] || point['lon'] || point['lng']
            let lat = point['latitude'] || point['Latitude'] || point['lat']

            let marker = new mapboxgl.Marker()    
            marker.setLngLat([lon, lat])
            marker.addTo(map)  

            let popup = new mapboxgl.Popup()
            popup.setHTML(point)
            marker.setPopup(popup)

            markers.push(marker)

        }

        map.setCenter(markers[0].getLngLat())

        if (markers.length > 1) {
            let bounds = new mapboxgl.LngLatBounds()
            for (const marker of markers) {
                bounds.extend(marker.getLngLat())
            }
            map.fitBounds(bounds, {padding: {top: 30, bottom: 30, left: 30, right: 30}})
        }

    }

    return map

}

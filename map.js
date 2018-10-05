let map = null;
let position = null;

if (!mapboxgl.supported()) alert("Your browser does not support Mapbox GL");
mapboxgl.accessToken = "pk.eyJ1IjoiYnJpYW5ob3VzZSIsImEiOiJXcER4MEl3In0.5EayMxFZ4h8v4_UGP20MjQ";
map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v9",
    center: [-73.96024, 40.80877],
    zoom: 16
});

map.addControl(new mapboxgl.NavigationControl({
    showCompass: false
}), "top-left");

map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
}), "bottom-right");

map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    fitBoundsOptions: {
    }
}).on('geolocate', function (e) {
    position = turf.point([e.coords.longitude, e.coords.latitude]);
    activate(position);
}), "top-left");

map.on('click', function(e) {            
    activate(turf.point([e.lngLat.lng, e.lngLat.lat]));
});

activate = function(point) {
    console.log(point);
    let lng = point.geometry.coordinates[0];
    let lat = point.geometry.coordinates[1];
    console.log("point: " + lng + "," + lat);    
    document.getElementById('info').innerHTML = lng.toFixed(5) + "," + lat.toFixed(5);            
};

getDistance = function(point_from, point_to) {
    let distance = turf.distance(point_from, point_to, 'miles') * 5280;
    return distance;
};

setInterval(function() {
    console.log("called");
    if (position != null) {
        activate(position);
    }
}, 5000);

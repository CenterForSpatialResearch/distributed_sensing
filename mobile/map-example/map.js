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
    console.log([e.coords.longitude, e.coords.latitude]);
}), "top-left");
